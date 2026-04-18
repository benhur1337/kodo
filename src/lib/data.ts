"use server";

import { db } from "@/src/index";
import { categories, userProgress } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchLessonCategory(slug: string) {
  const data = await db.query.categories.findFirst({
    where: (categories, { ilike }) => ilike(categories.name, slug),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
      },
    },
  });

  return data;
}

export async function fetchLessons() {
  try {
    const lessons = await db.select().from(categories);
    return lessons;
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error("Failed to fetch lessons.");
  }
}


export async function saveUserProgress(
  userId: string,
  categoryId: string,
  stepIndex: number,
  completed: boolean,
) {
  try {
    const result = await db
      .insert(userProgress)
      .values({
        userId: userId,
        categoryId: categoryId,
        currentStepIndex: stepIndex,
        isCompleted: completed,
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.categoryId],
        set: {
          isCompleted: completed,
          currentStepIndex: stepIndex,
          updatedAt: new Date(),
        },
      });

    return { success: true };
  } catch (error) {
    console.error("Save Progress Error:", error);
    return { success: false, error: "Failed to save" };
  }
}

export async function fetchUserProgress(userId: string) {
  try {
    const progress = await db.query.userProgress.findMany({
      where: eq(userProgress.userId, userId),
      with: {
        category: {
          with: {
            lessons: true,
          },
        },
      },
    });

    return JSON.parse(JSON.stringify(progress));
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
}