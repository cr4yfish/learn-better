"use client";

import { useEffect, useState } from "react";

import { User_Course } from "@/types/db";


import { Button } from "@/components/utils/Button";
import LevelScroller from "@/components/levelScroller/LevelScroller";
import Navigation from "@/components/utils/Navigation";
import BlurModal from "@/components/utils/BlurModal";
import Header from "@/components/utils/Header";
import CourseSelectSwiper from "@/components/course/CourseSelectSwiper";
import { SessionState } from "@/types/auth";
import Link from "next/link";
import { getCurrentUser } from "@/functions/supabase/auth";
import { upsertSettings } from "@/functions/supabase/settings";


export default function Home() {
  const [currentUserCourse, setCurrentUserCourse] = useState<User_Course>({} as User_Course)
  const [sessionState, setSessionState] = useState<SessionState>({} as SessionState)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSessionState = async () => {
    const res = await getCurrentUser()
    if(!res) {
      window.location.href = "/welcome"; // route user to login page
      return;
    }
    setSessionState(res as SessionState)

    const currentCourse = res?.settings.current_course;
    const userCourses = res?.courses;

    if(currentCourse) {
      setCurrentUserCourse(userCourses.find((uc) => uc.course.id == currentCourse.id) as User_Course)
    }
  }

  useEffect(() => {
    fetchSessionState();
  }, [])

  const handleCourseChange = async (userCourse: User_Course) => {
    setSessionState({...sessionState, settings: {...sessionState.settings, current_course: userCourse.course}})
    upsertSettings({
      ...sessionState.settings,
      current_course: userCourse.course,
      user: sessionState.user
    })
    setCurrentUserCourse(userCourse)
  }

  return (
    <>
    <main className="flex flex-col justify-between items-center w-full min-h-full h-full ">
      <Header currentUserCourse={currentUserCourse} onOpen={() => setIsModalOpen(true)} sessionState={sessionState} />
      <div className="relative w-full h-full">
        <LevelScroller currentUserCourse={currentUserCourse} />
      </div>
    </main>
    <Navigation activeTitle="Home" />

    <BlurModal 
      isOpen={isModalOpen}
      updateOpen={setIsModalOpen}
      settings={{
        hasHeader: true,
        hasBody: true,
        hasFooter: true,
      }}
      header={<>Your Courses</>}
      body={             
        <CourseSelectSwiper 
          userCourses={sessionState.courses} 
          currentUserCourse={currentUserCourse}
          setCurrentUserCourse={handleCourseChange} 
        />
      }
      footer={<Link href={"/community"}><Button color="secondary" variant="flat">View all courses</Button></Link>}
    />
    
    </>
  );
}
