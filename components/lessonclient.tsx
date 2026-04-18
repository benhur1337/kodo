"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useCallback } from "react";
import { Category } from "@/src/types";

import { python } from "@codemirror/lang-python";
import { PythonProvider, usePython } from "react-py";

import CodeMirror from "@uiw/react-codemirror";

import { saveUserProgress } from "@/src/lib/data";

export default function LessonClient({ data }: { data: Category }) {
  const lessonId = data.id
  const lessons = data.lessons;
  const totalLessons = lessons.length;
  const { user } = useUser();

  const [inLesson, setInLesson] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonSlide, setLessonSlide] = useState(0);

  function nextSlide() {
    const isLastSlide = lessonSlide === data.lessons[lessonIndex].content.length - 1;

    if (isLastSlide) {
      if (user) {
        const isLastLesson = lessonIndex + 1 === totalLessons;
        saveUserProgress(user.id, lessonId, lessonIndex + 1, isLastLesson);
      }
      exitLesson();
    } else {
      setLessonSlide((prev) => prev + 1);
    }
  }

  function enterLesson(lessonOrder: number) {
    setLessonIndex(lessonOrder);
    setLessonSlide(0);
    setInLesson(true);
  }

  function exitLesson() {
    setLessonIndex(0);
    setLessonSlide(0);
    setInLesson(false);
  }

  if (inLesson) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Slide
          lessonNumber={lessonIndex}
          lessonSlide={lessonSlide}
          data={data}
        />
        <div className="flex flex-row gap-4">
          <button onClick={nextSlide} className="btn btn-success text-white">
            Next
          </button>
          <button onClick={exitLesson} className="btn btn-primary">
            Lesson Chapters
          </button>
        </div>
      </div>
    );
  }

  if (!inLesson) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-4">
          {lessons.map((lesson) => (
            <button
              onClick={() => enterLesson(lesson.order - 1)}
              className="btn btn-secondary"
              key={lesson.order}
            >
              {lesson.title}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

function Slide({
  lessonNumber,
  lessonSlide,
  data,
}: {
  lessonNumber: number;
  lessonSlide: number;
  data: Category;
}) {
  const content = data.lessons[lessonNumber].content[lessonSlide];
  const [checkQuiz, setCheckQuiz] = useState("");
  const [quizTip, setQuizTip] = useState("font-bold text-xl text-success");

  function checkAnswer(item: string) {
    if (content.type === "quiz") {
      if (content.answer == item) {
        setCheckQuiz("Answer is Correct!");
        setQuizTip("font-bold text-xl text-success");
      } else {
        setCheckQuiz("Incorrect. Please try again.");
        setQuizTip("font-bold text-xl text-error");
      }
    }
  }

  if (content.type === "explanation") {
    return (
      <div className="text-2xl font-extrabold tracking-tighter">
        {content.text}
      </div>
    );
  }

  if (content.type === "quiz") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-extrabold tracking-tighter">
          {content.question}
        </p>
        <div className="flex flex-row gap-4">
          {content.options.map((item) => (
            <button
              onClick={() => checkAnswer(item)}
              className="btn btn-soft btn-success text-xl"
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <p className={quizTip}>{checkQuiz}</p>
      </div>
    );
  }

  if (content.type === "coding") {
    return (
      <div>
        <CodeBlock
          type={data.name.toLowerCase()}
          initialCode={content.initialCode}
          expectedOutput={content.expectedOutput}
        />
      </div>
    );
  }
}

function CodeBlock({
  type,
  initialCode,
  expectedOutput,
}: {
  type: string;
  initialCode: string;
  expectedOutput: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [codeResult, setCodeResult] = useState("");
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const onChange = useCallback((val: string) => {
    setCode(val);
  }, []);

  function handleRun() {
    runPython(code);
    if (stdout == expectedOutput) {
      console.log("Great!");
    }
  }

  function checkAnswer() {
    if (stdout == expectedOutput) {
      setCodeResult("Answer is correct!");
    } else {
      setCodeResult("Incorrect. Try again.");
    }
  }

  if (type == "python") {
    return (
      <div className="flex flex-col md:flex-row">
        <div className="w-full h-125 bg-primary">
          <CodeMirror
            value={code}
            theme="dark"
            onChange={onChange}
            extensions={[python()]}
            basicSetup={{
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
            }}
            height="500px"
          />
        </div>
        <PythonProvider packages={{ official: ["pyodide-http"] }}>
          <div className="w-full h-auto flex flex-col">
            <div className="p-4 h-full min-h-20 bg-black">
              <p className="text-gray-400">Output:</p>
              <p className="whitespace-pre">{stdout || stderr}</p>
            </div>
            <button
              className={`btn btn-primary rounded-none ${isRunning ? "loading" : ""}`}
              onClick={handleRun}
              disabled={isLoading}
            >
              {isRunning ? "Loading" : "Run Code"}
            </button>
          </div>
        </PythonProvider>
      </div>
    );
  }
}
