import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding database...");

  // 1. Create the Python Category
  const [pythonCategory] = await db
    .insert(schema.categories)
    .values({
      name: "Python",
      description: "Learn the most popular language for AI!",
      icon: "🐍",
    })
    .returning();

  // 2. Create Lesson 1: Variables
  await db.insert(schema.lessons).values([
    {
      categoryId: pythonCategory.id,
      title: "Variables 101",
      order: 1,
      content: [
        { type: "explanation", text: "Variables store data!" },
        {
          type: "quiz",
          question: "What defines a variable?",
          options: ["name", "color"],
          answer: "name",
        },
      ],
    },
    {
      categoryId: pythonCategory.id,
      title: "Data Types",
      order: 2,
      content: [
        {
          type: "explanation",
          text: "Python has Strings, Integers, and Floats.",
        },
        {
          type: "quiz",
          question: 'Is "Hello" a string?',
          options: ["Yes", "No"],
          answer: "Yes",
        },
      ],
    },
    {
      categoryId: pythonCategory.id,
      title: "The Grocery List",
      order: 3,
      content: [
        {
          type: "explanation",
          text: "A List is a way to store many items in one variable. We use square brackets `[]` to create them.",
          image: "https://placehold.co/600x400?text=[Item1,+Item2,+Item3]",
        },
        {
          type: "quiz",
          question: "How do you start a list in Python?",
          options: ["{ }", "( )", "[ ]"],
          answer: "[ ]",
        },
        {
          type: "explanation",
          text: "Important: Python starts counting from 0! So the first item in your list is actually at index 0.",
        },
      ],
    },
    {
      categoryId: pythonCategory.id,
      title: "Making Decisions",
      order: 4,
      content: [
        {
          type: "explanation",
          text: "If statements let your code make decisions. 'If it is raining, take an umbrella!'",
          image: "https://placehold.co/600x400?text=If+Condition+is+True...",
        },
        {
          type: "quiz",
          question:
            "Which keyword do we use to check a second condition if the first one was false?",
          options: ["else", "elif", "if-again"],
          answer: "elif",
        },
        {
          type: "explanation",
          text: "In Python, indentation (the space at the start of the line) is super important. It tells Python which code belongs to the 'If' block.",
        },
      ],
    },
  ]);

  console.log("Seeding finished! 🐍");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
