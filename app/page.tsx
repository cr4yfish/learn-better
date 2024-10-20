"use client";

import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalContent, useDisclosure, ModalFooter } from "@nextui-org/modal";

import { User_Course } from "@/types/db";


import { Button } from "@/components/utils/Button";
import LevelScroller from "@/components/levelScroller/LevelScroller";
import Navigation from "@/components/utils/Navigation";
import Header from "@/components/utils/Header";
import CourseSelectSwiper from "@/components/course/CourseSelectSwiper";
import { SessionState } from "@/types/auth";
import Link from "next/link";
import { getCurrentUser } from "@/functions/supabase/auth";
import { upsertSettings } from "@/functions/supabase/settings";


export default function Home() {
  const [currentUserCourse, setCurrentUserCourse] = useState<User_Course>({} as User_Course)
  const [sessionState, setSessionState] = useState<SessionState>({} as SessionState)
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

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
      <Header currentUserCourse={currentUserCourse} onOpen={onOpen} sessionState={sessionState} />
      <div className="relative w-full h-full">
        <LevelScroller currentUserCourse={currentUserCourse} />
      </div>
    </main>
    <Navigation activeTitle="Home" />

    <Modal 
        backdrop="blur"
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
    >
      <ModalContent>
          <ModalHeader>Your Courses</ModalHeader>
          <ModalBody>
              <CourseSelectSwiper 
                userCourses={sessionState.courses} 
                currentUserCourse={currentUserCourse}
                setCurrentUserCourse={handleCourseChange} 
              />
          </ModalBody>
          <ModalFooter>
            <Link href={"/community"}><Button>View all courses</Button></Link>
          </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
