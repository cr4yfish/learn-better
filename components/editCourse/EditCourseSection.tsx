"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardFooter } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";

import Icon from "../Icon";
import { Course_Section } from "@/types/db";
import { upsertCourseSection, deleteCourseSection } from "@/functions/client/supabase";


export default function EditCourseSection(
    { courseSection, courseSections, setCourseSections } : 
    { 
        courseSection: Course_Section, 
        courseSections: Course_Section[], 
        setCourseSections: (sections: Course_Section[]) => void
    }) {

    const [editingSection, setEditingSection] = useState<Course_Section>(courseSection);
    const [isEditingLoading, setIsEditingLoading] = useState(false);
    const [isCourseSectionDeleteLoading, setIsCourseSectionDeleteLoading] = useState(false);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

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
    

    return (
    <>
        <Card key={courseSection.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
            <span className=" font-bold">{courseSection.title}</span>
            </CardHeader>
            <CardFooter className="flex items-center justify-between gap-4">
            <Button 
                onClick={() => handleEditCourseSection(courseSection)} 
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
                onClick={() => handleDeleteCourseSection(courseSection)}
                isIconOnly
                isLoading={isCourseSectionDeleteLoading}
            >
                <Icon filled>delete</Icon>
            </Button>
            </CardFooter>
        </Card>

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
                    <Button 
                        color="warning" variant="flat" 
                        isDisabled={isEditingLoading} onClick={onClose}
                    >Cancel</Button>
                    <Button 
                        color="primary" variant="solid" 
                        isLoading={isEditingLoading} 
                        onClick={handleSaveCourseSection}
                    >Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    )
}