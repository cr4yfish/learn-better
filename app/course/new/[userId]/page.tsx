"use client";

import EditCourseForm from "@/components/editCourse/editCourseForm";

export default function NewCourse({ params: { userId }} : { params: { userId: string }}) {


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
    <>
        <EditCourseForm userId={userId} isNew={true}  />
    </>
  );
}