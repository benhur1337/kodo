import { pgTable, boolean, primaryKey, text, integer, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';



//Users table (reminder: I have the clerkId)
export const users = pgTable("users", {
   id: uuid("id").primaryKey().defaultRandom(),
   clerkId: text("clerk_id").unique().notNull(),
   xp:integer("xp").default(0),
   streak:integer("streak").default(0),
   lessons:integer("lessons").default(0),
   skills:integer("skills").default(0),
   updatedAt:timestamp("updated_at").defaultNow()
});


export const userProgress = pgTable("user_progress", {
    userId: text("user_id").notNull().references(() => users.clerkId),
    categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
    isCompleted: boolean("is_completed").default(false),
    currentStepIndex: integer("current_step_index").default(0),
    updatedAt: timestamp("updated_at").defaultNow()
}, (table) => ({
    pk: primaryKey({columns: [table.userId, table.categoryId]})
}));


/*

Lessons checklist:
1. Categories for lessons (Python, JS, etc.)
2. Lesson has each number (Python 1, Python 2, etc.)
3. Make sure I define the relationship for easy querying.

*/

export const categories = pgTable("categories", {
    id:uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    icon:text("icon")
})

export const lessons = pgTable("lessons", {
    id:uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade"}), // Anticipate mass deletion of courses
    title: text("title").notNull(),
    order: integer("order").notNull(),
    content: jsonb("content").notNull(), //Store lesson content as JSON array
    initialCode:text("initial_code"),

})


//Relations for easy querying

export const categoriesRelations = relations(categories, ({many}) => ({
    lessons: many(lessons),
}))


export const lessonsRelations = relations(lessons, ({one}) => ({
    category: one(categories, {
        fields: [lessons.categoryId],
        references: [categories.id]
    })
}))

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    user: one(users, {
        fields: [userProgress.userId],
        references: [users.clerkId], 
    }),
    category: one(categories, { 
        fields: [userProgress.categoryId],
        references: [categories.id]
    })
}));