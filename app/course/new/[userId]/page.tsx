"use server";

import EditCourseCard from "@/components/course/EditCourseCard";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import Link from "next/link";

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
            <Link href="/">
                <Button variant="light" startContent={<Icon filled>arrow_back</Icon>} >
                    Back
                </Button>
            </Link>
            <EditCourseCard userId={userId} isNew={true}  />
        </div>
  );
}