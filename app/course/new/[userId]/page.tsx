"use server";

import NewCourseMain from "@/components/course/NewCourseMain";

export default async function NewCourse({ params: { userId }} : { params: { userId: string }}) {


    if(!userId) {
        return (
            <>
            <div>
                <h1 className="font-bold text-4xl text-red-500">You have to provide a user id!</h1>
            </div>
            </>
        )
    }

    return (
        <div className="px-4 py-6 flex flex-col gap-2">
            <NewCourseMain userId={userId}  />
        </div>
  );
}