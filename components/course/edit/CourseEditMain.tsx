"use client";

import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

import { Course_Section, User_Course } from "@/types/db";

import { Button } from "@/components/utils/Button";
import CourseSectionCard from "@/components/courseSection/CourseSectionCard";
import Icon from "@/components/ui/Icon";
import { upsertCourseSection } from "@/utils/supabase/courseSections";


export default function CourseEditmain({ userCourse, initCourseSections } : { userCourse: User_Course, initCourseSections: Course_Section[] }) {
  const [courseSections, setCourseSections] = useState<Course_Section[]>(initCourseSections);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isOrderMode, setIsOrderMode] = useState(false);

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
      course: userCourse?.course,
      order: courseSections.length
    }
    
    setCourseSections([...courseSections, newCourseSection]);
  }

  return (
    <>

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
              <div className="flex items-center justify-between w-full">
                <span className=" font-bold">{section.title}</span>
              </div>
             
            </CardHeader>
            <CardBody className="flex flex-row items-center justify-end">
            <Icon>drag_indicator</Icon>
            </CardBody>
        </Card>
        ))}
    </ReactSortable>
    )}

 
    </>
  );
}