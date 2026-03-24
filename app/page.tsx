import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Kodo</h1>
            <p className="py-6">
              Learn to code, the Kodo way.
            </p>
            <Link href="/sign-up">
              <button className="btn btn-primary">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
