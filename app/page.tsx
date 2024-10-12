"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Modal, ModalHeader, ModalBody, ModalContent, useDisclosure, ModalFooter } from "@nextui-org/modal";

import { Course } from "@/types/db";

import { getCourses } from "@/functions/client/supabase";

import LevelScroller from "@/components/homepage/LevelScroller/LevelScroller";
import Navigation from "@/components/homepage/Navigation";
import Header from "@/components/homepage/Header";
import CourseSelect from "@/components/homepage/CourseSelect";


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
