import { useState } from "react";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input"

;
import { Question, Question_Type, Topic } from "@/types/db";
import Icon from "../Icon";
import { deleteQuestion, upsertQuestion } from "@/functions/client/supabase";

export default function EditQuestion({ question, updateValue, removeQuestion } : { question: Question, updateValue: (key:  keyof Question, value: string & string[] & Topic & Question_Type) => void , removeQuestion: (question: Question) => void  }) {
    const [integrity, setIntegrity] = useState(true);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const handleSaveQuestion = async () => {
        setIsSaveLoading(true);
        try {
            const res = await upsertQuestion(question);
            if(res.id.length > 0) {
                setIntegrity(true);
            } else {
                throw new Error("Error saving question");
            }
        } catch(e) {
            console.error(e);
            alert("Error saving question");
        }
        
        setIsSaveLoading(false);
    }

    const handleDeleteQuestion = async () => {
        setIsDeleteLoading(true);
        try {
            const res = await deleteQuestion(question.id);
            if(res) {
                setIntegrity(true);
                removeQuestion(question);
            } else {
                throw new Error("Error deleting question");       
            }
        } catch(e) {
            console.error(e);
            alert("Error deleting question");
        }
        
        setIsDeleteLoading(false);
    }

    const handleUpdateValue = (key: keyof Question,value: string | string[]) => {
        setIntegrity(false);
        updateValue(key, value as string & string[] & Topic & Question_Type);
    }

    const handleOptionValueChange = (value: string, index: number) => {
        
        // if the correct answer is changed, update the correct answer as well
        if(question.answer_options.length > 0 && question.answer_options[index] == question.answer_correct) {
            handleUpdateValue("answer_correct", value);
        }

        handleUpdateValue("answer_options", question.answer_options.map((o, i) => i == index ? value : o));
    }

    return (
        <>
        <Card>
            <CardBody className="flex flex-col gap-2">

                <span className="font-semibold">General information</span>
                <Input value={question.title} label="Question title" onChange={(e) => handleUpdateValue("title", e.target.value)} />
                <Input value={question.question} label="Question" onChange={(e) => handleUpdateValue("question", e.target.value)} />

                <div className="flex flex-col gap-1">
                    <span className=" font-semibold">Options</span>
                    {question.answer_options?.map((option, index) => (
                        <Input 
                            key={index} 
                            label={`Option ${index + 1}`} 
                            placeholder="Enter the option" 
                            value={option} 
                            onValueChange={(value) => handleOptionValueChange(value, index)}
                            description={option == question.answer_correct ? "Selected as correct answer" : ""}
                            endContent={(
                                <div className="flex flex-row items-center gap-1">
                                    { option == question.answer_correct ? 
                                        <Button 
                                            color="success" 
                                            variant="light" 
                                            isIconOnly
                                            onClick={() => handleUpdateValue("answer_correct", "")}
                                        >
                                            <Icon filled color="success">check_circle</Icon> 
                                        </Button> :
                                        <Button 
                                            color="success" 
                                            variant="light" 
                                            isIconOnly
                                            onClick={() => handleUpdateValue("answer_correct", option)}
                                        >
                                            <Icon color="success">check_circle</Icon>
                                        </Button>
                                    }
                                    <Button 
                                        color="danger" 
                                        variant="light" 
                                        isIconOnly
                                        onClick={() => handleUpdateValue("answer_options", question.answer_options.filter((o, i) => i != index))}
                                    >
                                        <Icon color="danger">delete</Icon>
                                    </Button>
                                </div>
                            )}
                        />
                    ))}
                    <div className="mt-1">
                        <Button 
                            color="warning" 
                            variant="light" 
                            startContent={<Icon color="warning" filled>add</Icon>}
                            onClick={() => handleUpdateValue("answer_options", question.answer_options ? [...question.answer_options, ""] : [""])}
                        >
                            Add an option
                        </Button>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="flex flex-row items-center gap-4"> 

                <Button 
                    color="primary" 
                    startContent={<Icon filled color="white">{integrity ? "check" : "save"}</Icon>} 
                    variant="solid"
                    isLoading={isSaveLoading}
                    isDisabled={integrity || isDeleteLoading}
                    onClick={handleSaveQuestion}
                >
                    {integrity ? "Saved" : "Save"}
                </Button>

                <Button 
                    color="danger" 
                    startContent={<Icon filled color="danger">delete</Icon>} 
                    variant="faded"
                    isDisabled={isSaveLoading}
                    isLoading={isDeleteLoading}
                    onClick={handleDeleteQuestion}
                >
                    Delete
                </Button>
                
            </CardFooter>
        </Card>
        </>
    )
}