"use client";

import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-row gap-4 p-6">
        <span className="loading loading-spinner text-primary"></span>
        <span className="skeleton skeleton-text">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row gap-4 text-5xl font-extrabold tracking-tighter px-6 pt-6">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img
              src={user?.imageUrl}
              height={100}
              width={100}
              alt="kodo user profile pic"
            />
          </div>
        </div>
        <span>
          Welcome <br /> {user?.firstName}, {user?.lastName}
        </span>
      </div>
      <br />

      {/* User Stats */}
      <div className="px-6">
        <div className="text-3xl font-extrabold tracking-tighter"> My Stats </div>
        <div className="divider"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="card w-full h-full text-white card-sm shadow-sm rounded-xl">
            <div className="card-body flex flex-col gap-0 justify-center items-center">
              <p className="text-xl font-extrabold tracking-tighter scale-110">🔥150 Days</p>
              <p className="text-xl tracking-tighter font-bold">Day Streak</p>
            </div>
          </div>
          <div className="card w-full h-full text-white card-sm shadow-sm rounded-xl">
            <div className="card-body flex flex-col gap-0 justify-center items-center">
              <p className="text-xl font-extrabold tracking-tighter scale-110">⚡1200 XP</p>
              <p className="text-xl tracking-tighter font-bold">Total Exp</p>
            </div>
          </div>
          <div className="card w-full h-full text-white card-sm shadow-sm rounded-xl">
            <div className="card-body flex flex-col gap-0 justify-center items-center">
              <p className="text-xl font-extrabold tracking-tighter scale-110">📔 100</p>
              <p className="text-xl tracking-tighter font-bold">Total Lessons</p>
            </div>
          </div>
          <div className="card w-full h-full text-white card-sm shadow-sm rounded-xl">
            <div className="card-body flex flex-col gap-0 justify-center items-center">
              <p className="text-xl font-extrabold tracking-tighter scale-110">🚀5</p>
              <p className="text-xl tracking-tighter font-bold">Skill Points</p>
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* Lesson Progress */}
      <div className="px-6">
        <div className="text-3xl font-extrabold tracking-tighter">
          {" "}
          Lesson Progress{" "}
        </div>
        <div className="divider"></div>
      </div>
      <div className="flex flex-row overflow-x-scroll">
        {
          [1,2,3,4,5,6,7,8,9,10].map((key) => (
            <CourseCard key={key}/>
          ))
        }
        <CourseCard/>
      </div>
    </div>
  );
}

function CourseCard() {
  return (
    <div className="card mx-4 min-w-45 bg-primary text-white bg-base-100 card-md shadow-sm rounded-xl">
      <div className="card-body flex flex-col gap-4 justify-center items-center">
        <div
          className="radial-progress text-white"
          style={{ "--value": 70 } as React.CSSProperties}
          aria-valuenow={70}
          role="progressbar"
        >
          70%
        </div>
        <h2 className="card-title text-center">Sample Course</h2>
        <div className="justify-end card-actions">
          <button className="btn btn-secondary">Continue Lesson</button>
        </div>
      </div>
    </div>
  );
}
