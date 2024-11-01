"use server";

import { redirect } from "next/navigation";
import Link from "next/link";

import { Course_Section, User_Course } from "@/types/db";

import { Button } from "@/components/utils/Button";
import EditCourseCard from "@/components/course/EditCourseCard";
import Icon from "@/components/utils/Icon";
import { getCurrentUser } from "@/utils/supabase/auth";
import { getUserCourse } from "@/utils/supabase/courses";
import { getCourseSections } from "@/utils/supabase/courseSections";
import CourseEditmain from "@/components/course/edit/CourseEditMain";


export default async function EditCourse({ params: { course }} : { params: { course: string }}) {

  const session = await getCurrentUser();

  if(!session?.user?.id) {
    redirect("/auth");
  }

  let userCourse: User_Course | null = null;

  try {
    userCourse = await getUserCourse(course, session.user.id);
  } catch (error) {
    console.error(error);
    redirect("/404");
  }

  userCourse.user = session.user;

  let courseSections: Course_Section[] = [];

  try {
    courseSections = await getCourseSections(course);
  } catch (error) {
    console.error(error);
  }

  return (
    <>
    <div className="px-4 py-6 overflow-y-auto h-full flex flex-col max-h-screen">
      <div>
        <Link href="/">
          <Button variant="light" startContent={<Icon filled>arrow_back</Icon>}>Back</Button>
        </Link>
        
      </div>
      <EditCourseCard 
        userId={userCourse?.user?.id} 
        isNew={false} 
        course={userCourse?.course} 
      />
      
      <CourseEditmain userCourse={userCourse} initCourseSections={courseSections} />

    </div>
 
    </>
  );
}