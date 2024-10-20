"use client";

import Navigation from "@/components/utils/Navigation";
import Courses from "@/components/course/Courses";


export default function Community() {

    return (
        <>
        <div className="flex px-4 py-6 flex-col gap-4 w-full">
            <h1 className="font-bold">Community</h1>

            <Courses />
        </div>
        <Navigation activeTitle="Community" />
        </>
    )
}