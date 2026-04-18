export type LessonStep =
  | { type: "explanation"; text: string }
  | {
      answer: string;
      type: "quiz";
      question: string;
      options: string[];
    }
  | { type: "coding"; initialCode: string; expectedOutput: string };

export interface Lesson {
  id: string;
  categoryId: string | null;
  title: string;
  order: number;
  content: LessonStep[];
  initialCode: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  lessons: Lesson[];
}
