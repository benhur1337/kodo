import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/src/index";

import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  const { userId: clerkId } = await auth();
  const user = await currentUser();

  if (!clerkId || !user) return null;

  const [dbUser] = await db
    .insert(users)
    .values({
      clerkId: clerkId,
      xp: 0,
      streak: 0,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { updatedAt: new Date() },
    })
    .returning();

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <h1 className="text-3xl font-bold text-white">
          Welcome, {user.fullName}!
        </h1>
        <p className="text-gray-400">Ready to continue your Kodo journey?</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Total XP
          </p>
          <p className="text-4xl font-black text-blue-500">{dbUser.xp}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Day Streak
          </p>
          <p className="text-4xl font-black text-orange-500">
            🔥 {dbUser.streak}
          </p>
        </div>
      </div>
    </div>
  );
}
