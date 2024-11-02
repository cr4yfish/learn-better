"use server";

import Link from "next/link";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import Navigation from "@/components/utils/Navigation";
import ShareCourseButton from "@/components/course/ShareCourseButton";

import { getSession } from "@/utils/supabase/auth";
import { getCourseById, getUserCourses } from "@/utils/supabase/courses";

import { User_Course } from "@/types/db";

type Params = {
    params: {
        courseId: string;
    }
}


export default async function CoursePage(params: Params) {

    const { data: { session }} = await getSession();
    const course = await getCourseById(params.params.courseId);

    let userCourses: User_Course[] = [];
    
    if(session?.user.id) {
        userCourses = await getUserCourses(session.user.id);
    }

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-6">
            <div className="flex flex-col gap-4">
                <h1 className=" font-bold text-2xl mb-0">{course.abbreviation}</h1>
                <h2 className="text-lg">{course.title}</h2>
                <ShareCourseButton showLabel courseId={course.id} />

                <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-4">

                        <div className="flex flex-col">
                            <span className=" text-tiny">Members</span>
                            <span>{course.members}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-tiny">Favourites</span>
                            <span>{course.votes}</span>
                        </div>


                    </div>

                    <div className="flex flex-row items-center gap-4">

                        <div className="flex flex-col">
                            <span className="text-tiny">Sections</span>
                            <span>{course.course_sections_count}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-tiny">Levels</span>
                            <span>{course.topics_count}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-tiny">Questions</span>
                            <span>{course.questions_count}</span>
                        </div>

                    </div>



                </div>

                <div className="flex flex-col">
                    <span className=" text-tiny">Course Creator</span>
                    <p>{course.creator.username}</p>
                </div>
                
                <div className="flex flex-col">
                    <span className=" text-tiny">Course Description</span>
                    <p>{course.description}</p>
                </div>
                
            </div>

        </div>
        
        <div className="flex flex-row items-center px-4 justify-end gap-4 pb-[100px]">
            {session?.user.id && 
            <>
                <Button isIconOnly variant="light" color="danger"><Icon>favorite</Icon></Button>
                { userCourses.find((userCourse) => userCourse.course.id === course.id) ?
                    <Button size="lg" variant="flat" color="danger">Leave the Course</Button>
                    :
                    <Button size="lg" variant="solid" color="primary">Join the Course</Button>
                }
            </>
            }


            {!session?.user.id && 
                <Link href="/login">
                    <Button size="lg" variant="solid" color="primary">Join the Course</Button>
                </Link>
            }
            
        </div>

        <Navigation activeTitle="Community" />
        </>
    )
    
}