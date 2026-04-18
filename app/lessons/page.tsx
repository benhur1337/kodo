import { auth } from "@clerk/nextjs/server";

import { fetchLessons, fetchUserProgress } from "@/src/lib/data";
import Link from "next/link";

export default async function Page() {
  const { userId } = await auth()

  const lessons = await fetchLessons();
  const userProgress = await fetchUserProgress(userId as string);

    

function findUserProg(lessonId:string){
    
   const data = userProgress.find((prog:any) => prog.categoryId == lessonId)

   
    

   return data
}

console.log(findUserProg("51aeea6e-a74d-4e07-ba2b-2d7253d1e0c1"))

  if (userId) {
    return (
      <div className="p-6">
        {lessons.map((lesson) => (
          <div key={lesson.id}>
            <p>progress: 

            </p>
            <h1 className="text-2xl font-extrabold tracking-tighter">
              {lesson.name}
            </h1>
            <Link
              href={"/lessons/" + lesson.name.toLowerCase()}
              className="btn btn-primary"
            >
              Learn
            </Link>
          </div>
        ))}
      </div>
    );
  }
}
