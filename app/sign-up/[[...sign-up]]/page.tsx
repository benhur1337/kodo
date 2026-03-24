import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
    <div>
        <div className="hero bg-base-200 min-h-screen">
            <SignUp/>
        </div>
    </div>
  )
}