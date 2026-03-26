"use client";

import { useState } from "react";

type LessonStep = 
    | { type: 'explanation'; text:string }
    | { type: 'quiz'; question: string; options: string[] }

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
              <button onClick={() => setCurrentIndex(item.order)} className="btn btn-soft btn-accent">{item.title}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return(
    <div className="flex flex-col gap-4 items-center">
        <h1 className="text-5xl font-extrabold tracking-tighter text-center"><span className="text-xl font-semibold tracking-normal">Lesson {currentIndex} :</span><br/>{data.lessons[currentIndex - 1].title}</h1>
        <div>
            <LessonStep lessonContent={data.lessons[currentIndex - 1].content}/>
        </div>
        <button onClick={() => setCurrentIndex(0)} className="btn btn-primary">Back to Course Menu</button>
    </div>
  )
}

function LessonStep({ lessonContent } : { lessonContent:LessonStep[]}){
    const [lessonIndex, setLessonIndex] = useState(0)

    function increaseLessonIndex(){
        if(lessonIndex < (lessonContent.length - 1)){
            setLessonIndex(lessonIndex + 1)
        } else {
            setLessonIndex(0)
        }
    }

    if(lessonContent[lessonIndex].type == "explanation"){
        return(
            <div className="card h-full w-full flex flex-col gap-4 justify-center items-center bg-gray-600 text-xl font-bold p-6">
                <p>{lessonContent[lessonIndex].text}</p>
                <button onClick={increaseLessonIndex} className="btn btn-xs btn-success text-white">Next</button>
            </div>
        )
    }

    if(lessonContent[lessonIndex].type == "quiz"){
        return(
            <div className="flex flex-col justify-center items-center gap-4">
                <p>{lessonContent[lessonIndex].question}</p>
                <div className="flex flex-row gap-4">
                    {
                        lessonContent[lessonIndex].options.map((item) => <button className="btn btn-soft btn-accent" key={item}>{item}</button>)
                    }
                </div>
                <button onClick={increaseLessonIndex} className="btn btn-xs btn-success text-white">Next</button>
            </div>
        )
    }
    
}