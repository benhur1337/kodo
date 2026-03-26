import { fetchLessonCategory } from "@/src/lib/data";
import LessonClient from "@/components/lessonclient";

type LessonStep = 
    | { type: 'explanation'; text:string }
    | { type: 'quiz'; question: string; options: string[] }

interface Lesson {
  id: string;
  categoryId: string | null;
  title: string;
  order: number;
  content: LessonStep[];
  initialCode: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  lessons: Lesson[];
}



export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchLessonCategory(slug);
  
  console.log(data)

  if (!data){
    return (
      <div className="flex flex-row gap-4 p-6">
        <span className="loading loading-spinner text-primary"></span>
        <span className="skeleton skeleton-text">Loading Lesson...</span>
      </div>
    );
  }
    
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      

      <LessonClient data={data as Category}/>
    </div>
  );
}
