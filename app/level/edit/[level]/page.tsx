"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, ModalHeader } from "@nextui-org/modal";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { deleteCourseTopic, getQuestions, getTopic, upsertCourseTopic } from "@/functions/client/supabase";
import { Question, Question_Type, Topic } from "@/types/db";

import Icon from "@/components/Icon";
import EditQuestion from "@/components/editLevel/EditQuestion";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";


export default function EditLevel({ params: { level } }: { params: { level: string } }) {
    const [topic, setTopic] = useState<Topic>({} as Topic);
    const [isLoadingTopic, setIsLoadingTopic] = useState(true);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

    const { onOpen, onClose, isOpen, onOpenChange } = useDisclosure();

    const [isAddingQuestionLoading, setIsAddingQuestionLoading] = useState(false);
    const [newQuestion, setNewQuestion] = useState<Question>({} as Question);

    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    
    useEffect(() => {
        async function fetchTopic() {
            // get the topic
            const res = await getTopic(level);
            setTopic(res);
            setIsLoadingTopic(false);

            // get the questions
            const resQuestions = await getQuestions(res.id);
            setQuestions(resQuestions);
            setIsLoadingQuestions(false);
        }
        
        if(!topic?.id) {
            fetchTopic();
        }
        
    }, [level, topic])

    const updateQuestionValue = (question: Question, key: keyof Question, value: string & string[] & Topic & Question_Type) => {
        setQuestions((prev) => {
            const index = prev.findIndex(q => q.id == question.id);
            (prev[index] as Question)[key] = value;
            return [...prev];
        })
    }

    const updateNewQuestionValue = (key: string, value: string) => {
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

    const handleUpdateTopic = async () => {
        setIsLoadingSave(true);
        setIsSaved(false);
        const res = await upsertCourseTopic(topic);
        
        if(res) {
            setIsSaved(true);
        }
        setIsLoadingSave(false);
    }

    const handleDeleteTopic = async () => {
        setIsLoadingDelete(true);
        const success = await deleteCourseTopic(topic);
        console.log(success);

        // route user to home
        window.location.href = "/";
        setIsLoadingDelete(false);
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
                <h1 className=" font-bold text-3xl">{isLoadingTopic ? <Spinner /> : topic?.title}</h1>
            </div>

            <Card>
                <CardHeader className="font-bold">General information</CardHeader>
                <CardBody>
                    <div className="flex flex-col gap-1">
                        <Input
                            label="Title" 
                            isDisabled={isLoadingTopic}
                            placeholder="Enter the title" 
                            description="Title of the level" 
                            value={topic.title}
                            onValueChange={(value) => setTopic((prev) => ({...prev, title: value}))}
                        />
                        <Input
                            label="Description" 
                            isDisabled={isLoadingTopic}
                            placeholder="Enter the description" 
                            description="Description of the level" 
                            value={topic.description}
                            onValueChange={(value) => setTopic((prev) => ({...prev, description: value}))}
                        />
                    </div>
                </CardBody>
                <CardFooter className="flex flex-row gap-4 items-center">
                    <Button 
                        variant="faded" color="primary" 
                        startContent={<Icon color="primary" filled>{isSaved ? "check_circle" : "save"}</Icon>} 
                        onClick={handleUpdateTopic}
                        isLoading={isLoadingSave}
                        isDisabled={isLoadingDelete || isLoadingTopic}
                    >
                        {isSaved ? "Saved" : "Save"}
                </Button>
                    <Button 
                        variant="faded" color="danger" 
                        startContent={<Icon color="danger" filled>delete</Icon>} 
                        onClick={handleDeleteTopic}
                        isLoading={isLoadingDelete}
                        isDisabled={isLoadingSave || isLoadingTopic}
                    >
                        Delete Level
                </Button>
                </CardFooter>
            </Card>
           
           <h2 className=" text-2xl font-bold">Questions</h2>
            {questions.length > 0 && 
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
            }
            {isLoadingQuestions && <Spinner />}
            {questions.length == 0 && !isLoadingQuestions && <p>No questions added yet</p>}
            {!isLoadingQuestions && 
                <div>
                    <Button
                        startContent={<Icon filled>add</Icon>}
                        color="primary"
                        onClick={onOpen}
                        isLoading={isLoadingQuestions}
                    >
                        {questions.length == 0 ? "Add a question" : "Add another question"}
                    </Button>
                </div>
            }


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
                    <Button color="primary" variant="shadow" onClick={() => addQuestion(newQuestion)} isLoading={isAddingQuestionLoading} >Add</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}