"use client";

import { getCurrentUser, getUserCourse } from "@/functions/client/supabase";
import { User_Course } from "@/types/db";
import { useState, useEffect } from "react";

import EditCourseForm from "@/components/editCourse/editCourseForm";

export default function EditCourse({ params: { course }} : { params: { course: string }}) {
  const [userCourse, setUserCourse] = useState<User_Course | undefined>();

  useEffect(() => {
    const fetchUserCourse = async () => {
      const res = await getUserCourse(course);
      
      const sessionState = await getCurrentUser();

      res.user = sessionState?.user;

      return res;
    }

    fetchUserCourse().then(setUserCourse);
  }, [course]);

  useEffect(() => {
    if(userCourse) {
      console.log(userCourse);
    }
  }, [userCourse]);

  return (
    <div>
      {userCourse?.user && userCourse.course && <EditCourseForm userId={userCourse?.user.id} isNew={false} course={userCourse?.course} />}

      
    </div>
  );
}