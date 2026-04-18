import { fetchLessonCategory } from "@/src/lib/data";
import LessonClient from "@/components/lessonclient";
import { Category } from "@/src/types";


export default async function Page({
    params,
}:{
    params:Promise<{lesson: string}>
}){

    const {lesson} = await params;

    const data = await fetchLessonCategory(lesson)

    if (!data){
        return(
            <div>Loading...</div>
        )
    }

    return(
        <div className="p-6">
            <LessonClient data={data as Category}/>
        </div>
    )
}