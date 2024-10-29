"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@nextui-org/input";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";

import { Question, Question_Type, Topic } from "@/types/db";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import BlurModal from "@/components/utils/BlurModal";
import EditQuestion from "@/components/level/question/EditQuestion";

import { upsertCourseTopic, deleteCourseTopic } from "@/utils/supabase/topics";
import { QuestionTypes } from "@/utils/constants/question_types";
import { SharedSelection } from "@nextui-org/system";


export default function LevelEditMain({ initTopic, initQuestions } : { initTopic: Topic, initQuestions: Question[] }) {
    const [topic, setTopic] = useState(initTopic);
    const [questions, setQuestions] = useState(initQuestions);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState<Question_Type>(QuestionTypes.multiple_choice);

    const [isAddingQuestionLoading, setIsAddingQuestionLoading] = useState(false);
    const [newQuestion, setNewQuestion] = useState<Question>({} as Question);

    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

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

        question.type = selectedQuestionType;
        question.topic = topic;
        question.id = uuidv4();
        
        if(question.type.title == "Boolean") {
            question.answers_correct = ["true", "false"];
            question.answer_options = ["true", "false"];
        } else {
            question.answers_correct = [];
            question.answer_options = [];
        }

        // only add it locally for now, since options are still missing
        setQuestions((prev) => {
            return [...prev, question];
        })

        setIsAddingQuestionLoading(false);
        setIsModalOpen(false);
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
        await deleteCourseTopic(topic);

        // route user to home
        window.location.href = "/";
        setIsLoadingDelete(false);
    }

    const handleQuestionTypeSelectChange = (e: SharedSelection) => {
        const id = e.currentKey;
        const type = Object.values(QuestionTypes).find(q => q.id == id);
        if(type) setSelectedQuestionType(type);
    }

    return (
        <>

        <Card className="min-h-[300px]">
            <CardHeader className="font-bold">General information</CardHeader>
            <CardBody>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Title" 
                        placeholder="Enter the title" 
                        description="Title of the level" 
                        value={topic.title}
                        onValueChange={(value) => setTopic((prev) => ({...prev, title: value}))}
                    />
                    <Input
                        label="Description" 
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
                    className="text-primary"
                    startContent={<Icon filled>{isSaved ? "check_circle" : "save"}</Icon>} 
                    onClick={handleUpdateTopic}
                    isLoading={isLoadingSave}
                    isDisabled={isLoadingDelete}
                >
                    {isSaved ? "Saved" : "Save"}
            </Button>
                <Button 
                    variant="faded" color="danger" 
                    startContent={<Icon color="danger" filled>delete</Icon>} 
                    onClick={handleDeleteTopic}
                    isLoading={isLoadingDelete}
                    isDisabled={isLoadingSave}
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

        {questions.length == 0 && <p>No questions added yet</p>}
            <div>
                <Button
                    startContent={<Icon filled>add</Icon>}
                    color="primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    {questions.length == 0 ? "Add a question" : "Add another question"}
                </Button>
            </div>
        
        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>Add a new question</>}
            body={
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold">General information</h2>
                        <Select
                            label="Select a Question Type"
                            description="Select the type of question you want to add"
                            placeholder="Select a topic"
                            selectionMode="single"
                            selectedKeys={[selectedQuestionType?.id]}
                            defaultSelectedKeys={["5570443a-63bb-4158-b86a-a2cef3457cf0"]}
                            disabledKeys={["6335b9a6-2722-4ece-a142-4749f57e6fed"]}
                            value={topic.title}
                            onSelectionChange={(e) => e.currentKey && handleQuestionTypeSelectChange(e)}
                        >
                            <SelectSection title="Select a question type" >
                                <SelectItem key={"5570443a-63bb-4158-b86a-a2cef3457cf0"} value="1">Multiple Choice</SelectItem>
                                <SelectItem key={"33b2c6e5-df24-4812-a042-b5bed4583bc0"} value="2">Boolean</SelectItem>
                                <SelectItem key={"6335b9a6-2722-4ece-a142-4749f57e6fed"} value="3">Fill in the blank</SelectItem>
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
                </>
            }
            footer={
                <>
                    <Button color="warning" variant="light" onClick={() => setIsModalOpen(false)} isDisabled={isAddingQuestionLoading} >Cancel</Button>
                    <Button color="primary" variant="shadow" onClick={() => addQuestion(newQuestion)} isLoading={isAddingQuestionLoading} >Add</Button>
                </>
            }
        />


        </>
    )
}