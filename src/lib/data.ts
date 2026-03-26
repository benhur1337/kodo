import { db } from "@/src/index";
import { categories } from "../db/schema";

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

export async function fetchLessons(){
  try{
    const lessons = await db.select().from(categories);
    return lessons
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error("Failed to fetch lessons.");
  }
}
