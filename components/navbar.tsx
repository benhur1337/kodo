import { ClerkProvider, UserButton, Show, SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <ClerkProvider>
      <div className="flex flex-row items-center justify-between navbar bg-base-100 shadow-sm fixed z-50">
        <div>
          <Show when="signed-in">
            <Link
              className="flex flex-row items-center gap-2 text-xl font-extrabold p-2"
              href="/dashboard"
            >
              <Image
                src={"/kodo-logo.png"}
                height={50}
                width={50}
                alt="Kodo Logo"
              />
              Kodo
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              className="flex flex-row items-center gap-2 text-xl font-extrabold p-2"
              href="/"
            >
              <Image
                src={"/kodo-logo.png"}
                height={50}
                width={50}
                alt="Kodo Logo"
              />
              Kodo
            </Link>
          </Show>
        </div>
        <div>
          <ul className="menu menu-horizontal items-center px-1">
            <Show when="signed-in">
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/lessons">Lessons</Link>
              </li>
              <li>
                <UserButton />
              </li>
              
            </Show>
            <Show when="signed-out">
              <Link className="btn btn-secondary" href="/sign-in">
                Sign In
              </Link>
              <Link className="btn btn-primary" href="/sign-up">
                Sign Up
              </Link>
            </Show>
          </ul>
        </div>
      </div>
    </ClerkProvider>
  );
}
