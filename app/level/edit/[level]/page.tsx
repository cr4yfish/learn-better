"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, ModalHeader } from "@nextui-org/modal";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { getQuestions, getTopic, upsertQuestion } from "@/functions/client/supabase";
import { Question, Topic } from "@/types/db";

import Icon from "@/components/Icon";
import EditQuestion from "@/components/editLevel/EditQuestion";


export default function EditLevel({ params: { level } }: { params: { level: string } }) {
    const [topic, setTopic] = useState<Topic>({} as Topic);
    const [questions, setQuestions] = useState<Question[]>([]);
    const { onOpen, onClose, isOpen, onOpenChange } = useDisclosure();

    const [isAddingQuestionLoading, setIsAddingQuestionLoading] = useState(false);
    const [newQuestion, setNewQuestion] = useState<Question>({} as Question);
    
    useEffect(() => {
        async function fetchTopic() {
            // get the topic
            const res = await getTopic(level);
            setTopic(res);

            // get the questions
            const resQuestions = await getQuestions(res.id);
            setQuestions(resQuestions);
        }
        
        if(!topic?.id) {
            fetchTopic();
        }
        
    }, [level, topic])

    useEffect(() => {
        console.log(questions)
    }, [questions])

    const updateQuestionValue = (question: Question, key: string, value: any) => {
        setQuestions((prev) => {
            const index = prev.findIndex(q => q.id == question.id);
            prev[index][key] = value;
            return [...prev];
        })
    }

    const updateNewQuestionValue = (key: string, value: any) => {
        setNewQuestion((prev) => {
            return {
                ...prev,
                [key]: value,
            }
        });
    }
    
    const removeQuestion = (question: Question) => {
        setQuestions((prev) => {
            return prev.filter(q => q.id != question.id);
        })
    }

    const addQuestion = async (question: Question) => {
        setIsAddingQuestionLoading(true);

        question.type = {
            id: "5570443a-63bb-4158-b86a-a2cef3457cf0",
            title: "Multiple Choice",
            description: "Multiple choice question",
        }; // multiple choice enforced for now

        question.topic = topic;
        question.id = uuidv4();

        // only add it locally for now, since options are still missing
        setQuestions((prev) => {
            return [...prev, question];
        })

        setIsAddingQuestionLoading(false);
        onClose();
    }

    return (
        <>
        <div className="px-4 py-6 flex flex-col gap-4 overflow-y-scroll h-fit min-h-full">
            <div className="flex flex-row flex-nowrap items-center gap-4">
                <Link href="/">
                    <Button isIconOnly variant="light">
                        <Icon filled>arrow_back</Icon>
                    </Button>
                </Link>
                <h1 className=" font-bold text-4xl">Editing {topic?.title}</h1>
            </div>
           
            <Accordion>
                {questions.map((question) => (
                    <AccordionItem key={question.id} title={question.question} subtitle={question.title}>
                        <EditQuestion 
                            question={question} 
                            updateValue={(key, value) => updateQuestionValue(question, key, value)} 
                            removeQuestion={() => removeQuestion(question)}    
                        />
                    </AccordionItem>
                ))}
            </Accordion>
            <div>
                <Button
                    startContent={<Icon filled>add</Icon>}
                    color="primary"
                    onClick={onOpen}
                >
                    Add another question
                </Button>
            </div>


        </div>

        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                <ModalHeader>Add a new question</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold">General information</h2>
                        <Select
                            label="Select a Question Type"
                            description="Select the type of question you want to add"
                            placeholder="Select a topic"
                            selectionMode="single"
                            selectedKeys={["multipleChoice"]}
                            defaultSelectedKeys={["multipleChoice"]}
                            disabledKeys={["topic2", "topic3"]}
                            value={topic.title}
                            onSelectionChange={(e) => console.log(e)}
                        >
                            <SelectSection  
                                title="Select a question type"
                                >
                                <SelectItem key={"multipleChoice"} value="1">Multiple Choice</SelectItem>
                                <SelectItem key={"topic2"} value="2">Boolean</SelectItem>
                                <SelectItem key={"topic3"} value="3">Fill in the blank</SelectItem>
                            </SelectSection>
                        </Select>
                        <Input
                            label="Question title" 
                            placeholder="Enter the question" 
                            description="Title describing the question" 
                            onValueChange={(value) => updateNewQuestionValue("title", value)}
                        />
                        <Input
                            label="Question" 
                            placeholder="Enter the question itself" 
                            description="The question itself" 
                            onValueChange={(value) => updateNewQuestionValue("question", value)}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" variant="light" onClick={onClose} isDisabled={isAddingQuestionLoading} >Cancel</Button>
                    <Button color="primary" variant="shadow" onClick={() => addQuestion(newQuestion)} isLoading={isAddingQuestionLoading} >Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}