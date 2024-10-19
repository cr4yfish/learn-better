"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";

import { getCurrentUser, getUserCourse, getCourseSections, upsertCourseSection, deleteCourseSection } from "@/functions/client/supabase";
import { Course_Section, User_Course } from "@/types/db";

import { Button } from "@/components/Button";
import EditCourseForm from "@/components/editCourse/editCourseForm";
import Icon from "@/components/Icon";
import { Input } from "@nextui-org/input";

export default function EditCourse({ params: { course }} : { params: { course: string }}) {
  const [userCourse, setUserCourse] = useState<User_Course | undefined>();
  const [courseSections, setCourseSections] = useState<Course_Section[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isOrderMode, setIsOrderMode] = useState(false);

  const { onOpen, onClose, isOpen, onOpenChange } = useDisclosure();
  const [editingSection, setEditingSection] = useState<Course_Section>({} as Course_Section);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isCourseSectionDeleteLoading, setIsCourseSectionDeleteLoading] = useState(false);

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

  const handleEditCourseSection = (section: Course_Section) => {
    setEditingSection(section); 
    onOpen();
  }

  const handleSaveCourseSection = async () => {
    if(editingSection && editingSection.title.length > 0 && editingSection.description.length > 0) {
      setIsEditingLoading(true);
      const { id } = await upsertCourseSection(editingSection);
      if(id) {
        // update in state
        const index = courseSections.findIndex((section) => section.id === id);
        if(index !== -1) {
          const newState = [...courseSections];
          newState[index] = editingSection;
          setCourseSections([...newState]);
        } else {
          setCourseSections([...courseSections, editingSection]);	
        }
      }
      onOpenChange();
      setIsEditingLoading(false);
    }
  }

  const handleDeleteCourseSection = async (section: Course_Section) => {
    setIsCourseSectionDeleteLoading(true);
    if(window.confirm("Are you sure you want to delete this section?")) {
      const res = await deleteCourseSection(section.id);
      if(res) {
        // remove from state
        const index = courseSections.findIndex((s) => s.id === section.id);
        if(index !== -1) {
          const newState = [...courseSections];
          newState.splice(index, 1);
          setCourseSections([...newState]);
        }
      }
    }
    setIsCourseSectionDeleteLoading(false);
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
    setEditingSection(newCourseSection);
    onOpen();
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
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <span className=" font-bold">{section.title}</span>
              </CardHeader>
              <CardFooter className="flex items-center justify-between gap-4">
                <Button 
                  onClick={() => handleEditCourseSection(section)} 
                  color="warning"
                  isDisabled={isCourseSectionDeleteLoading} 
                  variant="flat"
                  startContent={<Icon filled>edit</Icon>}
                >
                  Edit
                </Button>
                <Button
                  variant="bordered"
                  color="danger"
                  onClick={() => handleDeleteCourseSection(section)}
                  isIconOnly
                  isLoading={isCourseSectionDeleteLoading}
                >
                  <Icon filled>delete</Icon>
                </Button>
              </CardFooter>
            </Card>
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
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>{editingSection?.title || "New Course Section"}</ModalHeader>
        <ModalBody>
          <Input 
            label="Title" 
            isRequired 
            value={editingSection?.title} 
            onValueChange={(value) => setEditingSection({...editingSection, title: value})}
          />
          <Input 
            label="Description" 
            isRequired 
            value={editingSection?.description} 
            onValueChange={(value) => setEditingSection({...editingSection, description: value})}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="warning" variant="flat" isDisabled={isEditingLoading} onClick={onClose}>Cancel</Button>
          <Button color="primary" variant="solid" isLoading={isEditingLoading} onClick={handleSaveCourseSection}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}