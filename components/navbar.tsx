import { ClerkProvider, UserButton, Show } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between navbar bg-base-100 shadow-sm fixed">
      <div>
        <Link className="flex flex-row items-center gap-2 text-xl font-extrabold p-2" href="/"><Image src={"/kodo-logo.png"} height={50} width={50} alt="Kodo Logo"/>Kodo</Link>
      </div>
      <div>
        <ul className="menu menu-horizontal items-center px-1 gap-4">
          <li>
            <a>Link</a>
          </li>
          <ClerkProvider>
            <Show when="signed-in">
                <UserButton/>
            </Show>
            <Show when="signed-out">
                <Link className="btn btn-primary" href="/sign-in">Sign In</Link>
            </Show>
          </ClerkProvider>
        </ul>
      </div>
    </div>
  );
}
