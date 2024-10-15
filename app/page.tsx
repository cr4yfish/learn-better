"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Modal, ModalHeader, ModalBody, ModalContent, useDisclosure, ModalFooter } from "@nextui-org/modal";

import { User_Course } from "@/types/db";

import { getCurrentUser } from "@/functions/client/supabase";

import LevelScroller from "@/components/homepage/LevelScroller/LevelScroller";
import Navigation from "@/components/homepage/Navigation";
import Header from "@/components/homepage/Header";
import CourseSelect from "@/components/homepage/CourseSelect";
import { SessionState } from "@/types/auth";
import Link from "next/link";


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
        className="dark"
        backdrop="blur"
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
    >
      <ModalContent>
          <ModalHeader>Your Courses</ModalHeader>
          <ModalBody>
              <CourseSelect 
                userCourses={sessionState.courses} 
                currentUserCourse={currentUserCourse}
                setCurrentUserCourse={setCurrentUserCourse} 
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
