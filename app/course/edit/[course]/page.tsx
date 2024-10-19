"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

import { getCurrentUser, getUserCourse, getCourseSections, upsertCourseSection } from "@/functions/client/supabase";
import { Course_Section, User_Course } from "@/types/db";

import { Button } from "@/components/Button";
import EditCourseForm from "@/components/editCourse/EditCourseForm";
import CourseSectionCard from "@/components/editCourse/CourseSectionCard";
import Icon from "@/components/Icon";


export default function EditCourse({ params: { course }} : { params: { course: string }}) {
  const [userCourse, setUserCourse] = useState<User_Course | undefined>();
  const [courseSections, setCourseSections] = useState<Course_Section[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isOrderMode, setIsOrderMode] = useState(false);

  useEffect(() => {
    const fetchUserCourse = async () => {
      const res = await getUserCourse(course);
      const sessionState = await getCurrentUser();
      res.user = sessionState?.user;

      return res;
    }

    const fetchCourseSections = async () => {
      const res = await getCourseSections(course);
      if(res) {
        setCourseSections(res);
      }
    }

    fetchUserCourse().then(setUserCourse);
    fetchCourseSections();
  }, [course]);

  const updateOrder = async () => {
    setLoadingOrder(true);
    courseSections.forEach(async (section, index) => {
      section.order = index;

      // remove the .chosen property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (section as any).chosen
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (section as any).selected;

      await upsertCourseSection(section);
    })
    setIsOrderMode(false);
    setLoadingOrder(false);
  }

  const handleAddCourseSection = () => {
    if(!userCourse?.course) return;

    const newCourseSection: Course_Section = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      title: "",
      description: "",
      course: userCourse?.course
    }
    
    setCourseSections([...courseSections, newCourseSection]);
  }

  return (
    <>
    <div className="px-4 py-6 overflow-y-auto h-full flex flex-col gap-4">
      <EditCourseForm 
        userId={userCourse?.user?.id} 
        isNew={false} 
        course={userCourse?.course} 
      />
      

      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl p-0">Course Sections</h2>

        <Button
          onClick={() => isOrderMode ? updateOrder() : setIsOrderMode(true)}
          color="warning"
          variant={isOrderMode ? "solid" : "flat" }
          isLoading={loadingOrder}
          startContent={<Icon filled>{isOrderMode ? "save" : "sort"}</Icon>}
        >
          {isOrderMode ? "Save Order" : "Edit Order"}
        </Button>        
      </div>

      { !isOrderMode && (
        <div className="flex flex-col gap-2">
          {courseSections.map((section) => (
            <CourseSectionCard 
              key={section.id} 
              courseSection={section} 
              courseSections={courseSections} 
              setCourseSections={setCourseSections}
            />
          ))}
          <Button
            onClick={handleAddCourseSection} 
            color="primary"
            variant="solid"
          >Add course section</Button>
        </div>
      )}

      { isOrderMode && (
        <ReactSortable list={courseSections} setList={setCourseSections} className=" overflow-y-auto max-h-[50vh] ">
          {courseSections?.map((section) => (
            <Card key={section.id} className=" mb-2  cursor-move select-none">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <span className=" font-bold">{section.title}</span>
              </CardHeader>
              <CardBody className="flex flex-row items-center justify-end">
                <Icon>drag_indicator</Icon>
              </CardBody>
            </Card>
          ))}
        </ReactSortable>
      )}

    </div>
 
    </>
  );
}