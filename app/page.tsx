"use client";

import { useEffect, useState } from "react";

import Header from "@/components/homepage/Header";
import LevelScroller from "@/components/homepage/LevelScroller/LevelScroller";
import { Course } from "@/types/db";
import { getCourses } from "@/functions/client/supabase";
import Navigation from "@/components/homepage/Navigation";
import { Modal, ModalHeader, ModalBody, ModalContent, useDisclosure, ModalFooter } from "@nextui-org/modal";
import CourseSelect from "@/components/homepage/CourseSelect";
import { Button } from "@nextui-org/button";

export default function Home() {
  const [currentCourse, setCurrentCourse] = useState<Course>({} as Course)
  const [courses, setCourses] = useState<Course[]>([])
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

  const fetchCourses = async () => {
    const res = await getCourses()
    console.log(res)
    setCourses(res)
    setCurrentCourse(res[0])
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <>
    <main className="flex flex-col justify-between items-center w-full min-h-full h-full ">
      <Header currentCourse={currentCourse} courses={courses} onOpen={onOpen} />
      <LevelScroller currentCourse={currentCourse} />
    </main>
    <Navigation />

    <Modal 
        className="dark"
        backdrop="blur"
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
    >
      <ModalContent>
          <ModalHeader>Your Courses</ModalHeader>
          <ModalBody>
              <CourseSelect courses={courses} currentCourse={currentCourse} setCurrentCourse={setCurrentCourse} />
          </ModalBody>
          <ModalFooter>
            <Button>View all courses</Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
