import Link from "next/link";
import { fetchLessons } from "@/src/lib/data";



export default async function Page() {

  const lessons = await fetchLessons();

  console.log(lessons)

  return (
    <div>
      <div className="p-6">
        <div className="text-5xl font-extrabold tracking-tighter">
          {" "}
          Lessons
          {" "}
        </div>
        <div className="divider"></div>
      </div>
      <div className="flex flex-row overflow-x-scroll">
        {
          lessons.map((item) => <CourseCard key={item.id} title={item.name}/>)
        }
      </div>
    </div>
  );
}

function CourseCard({ title } : { title:string }) {
  return (
    <div className="card mx-4 min-w-45 text-white bg-primary card-md shadow-sm rounded-xl">
      <div className="card-body flex flex-col gap-4 justify-center items-center">
        <div
          className="radial-progress text-white"
          style={{ "--value": 70 } as React.CSSProperties}
          aria-valuenow={70}
          role="progressbar"
        >
          70%
        </div>
        <h2 className="card-title text-center">{ title }</h2>
        <div className="justify-end card-actions">
          <Link href={"./lessons/" + title.toLowerCase()}>
            <button className="btn btn-secondary">Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
