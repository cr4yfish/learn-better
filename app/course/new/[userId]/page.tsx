"use client";

import EditCourseCard from "@/components/editCourse/EditCourseCard";

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
        <EditCourseCard userId={userId} isNew={true}  />
    </>
  );
}