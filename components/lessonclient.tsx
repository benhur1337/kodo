"use client";

import { useState, useEffect, useCallback } from "react";
import { python } from "@codemirror/lang-python";
import { PythonProvider, usePython } from "react-py";
import CodeMirror from "@uiw/react-codemirror";

type LessonStep =
  | { type: "explanation"; text: string }
  | { type: "quiz"; question: string; options: string[] }
  | { type: "coding"; initialCode: string; expectedOutput: string };

interface Lesson {
  id: string;
  categoryId: string | null;
  title: string;
  order: number;
  content: LessonStep[];
  initialCode: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  lessons: Lesson[];
}

export default function LessonClient({ data }: { data: Category }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(data);

  if (currentIndex == 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col text-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tighter">
            {" "}
            Welcome to {data.name}
          </h1>
          <p className="text-md">{data.description}</p>
        </div>
        <ul className="steps steps-vertical">
          {data.lessons.map((item) => (
            <li className="step step-primary" key={item.id}>
              <button
                onClick={() => setCurrentIndex(item.order)}
                className="btn btn-soft btn-accent"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-5xl font-extrabold tracking-tighter text-center">
        <span className="text-xl font-semibold tracking-normal">
          Lesson {currentIndex} :
        </span>
        <br />
        {data.lessons[currentIndex - 1].title}
      </h1>
      <div>
        <LessonStep
          category={data.name.toLowerCase()}
          lessonContent={data.lessons[currentIndex - 1].content}
        />
      </div>
      <button onClick={() => setCurrentIndex(0)} className="btn btn-primary">
        Back to Course Menu
      </button>
    </div>
  );
}

function LessonStep({
  lessonContent,
  category,
}: {
  lessonContent: LessonStep[];
  category: string;
}) {
  useEffect(() => {
    async function init() {
      // @ts-expect-error to load pyodide
      const pyodide = await window.loadPyodide();

      await pyodide.loadPackage("pyodide-http");
      console.log("Pyodide is ready.");
    }
  }, []);

  const [lessonIndex, setLessonIndex] = useState(0);

  function increaseLessonIndex() {
    if (lessonIndex < lessonContent.length - 1) {
      setLessonIndex(lessonIndex + 1);
    } else {
      setLessonIndex(0);
    }
  }

  if (lessonContent[lessonIndex].type == "explanation") {
    return (
      <div className="card h-full w-full flex flex-col gap-4 justify-center items-center bg-gray-600 text-xl font-bold p-6">
        <p>{lessonContent[lessonIndex].text}</p>
        <button
          onClick={increaseLessonIndex}
          className="btn btn-xs btn-success text-white"
        >
          Next
        </button>
      </div>
    );
  }

  if (lessonContent[lessonIndex].type == "quiz") {
    return (
      <div className="flex flex-col justify-between items-center gap-4">
        <p>{lessonContent[lessonIndex].question}</p>
        <div className="flex flex-row gap-4">
          {lessonContent[lessonIndex].options.map((item) => (
            <button className="btn btn-soft btn-accent" key={item}>
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={increaseLessonIndex}
          className="btn btn-xs btn-success text-white"
        >
          Next
        </button>
      </div>
    );
  }

  if (lessonContent[lessonIndex].type == "coding") {
    return (
      <div>
        <CodeBlock
          type={category}
          initialCode={lessonContent[lessonIndex].initialCode}
          expectedOutput={lessonContent[lessonIndex].expectedOutput}
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
      <PythonProvider>
        <div className="flex flex-col gap-4">
          <div className="border-4 border-primary rounded-lg">
            <CodeMirror
              value={code}
              theme="dark"
              onChange={onChange}
              extensions={[python()]}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
              }}
              height="250px"
              width="300px"
              className="rounded-lg"
            />
          </div>

          <button
            className={`btn btn-primary ${isRunning ? "loading" : ""}`}
            onClick={handleRun}
            disabled={isLoading}
          >
            {isRunning ? "Loading" : "Run Code"}
          </button>
          <div className="p-4 bg-black min-h-20 h-auto max-w-75 rounded-lg">
            <p className="text-gray-400">Output:</p>
            <p className="whitespace-pre">{stdout || stderr}</p>
          </div>
        </div>
      </PythonProvider>
    );
  }
}
