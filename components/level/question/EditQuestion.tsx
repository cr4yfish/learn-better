"use client";

import { useState } from "react";

import { Button } from "@/components/utils/Button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input"

;
import { Question, Question_Type, Topic } from "@/types/db";
import Icon from "@/components/utils/Icon";
import { upsertQuestion, deleteQuestion } from "@/utils/supabase/questions";
import { QuestionTypes } from "@/utils/constants/question_types";
import EditMultipleChoice from "./questionTypes/EditMultipleChoice";
import EditBoolean from "./questionTypes/EditBoolean";
import EditMatchCards from "./questionTypes/EditMatchCards";

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
        console.log("Update value:",key, value)
        updateValue(key, value as string & string[] & Topic & Question_Type);
    }

    const handleOptionValueChange = (value: string, index: number) => {
        
        // if the correct answer is changed, update the correct answer as well
        if(question.answer_options.length > 0 && question.answers_correct.includes(question.answer_options[index])) {
            handleUpdateValue("answers_correct", [...question.answers_correct, value]);
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

                {question.type.id == QuestionTypes.multiple_choice.id && 
                    <EditMultipleChoice 
                        question={question} 
                        handleUpdateValue={handleUpdateValue} 
                        handleOptionValueChange={handleOptionValueChange} 
                    />
                }

                {question.type.id == QuestionTypes.boolean.id &&
                    <EditBoolean
                        question={question} 
                        handleUpdateValue={handleUpdateValue}
                    />
                }

                {question.type.id == QuestionTypes.match_the_words.id &&
                <>
                    <EditMatchCards
                        question={question} 
                        handleUpdateValue={handleUpdateValue}
                        handleOptionValueChange={handleOptionValueChange}
                    />
                </>
                }

                {question.type.id == QuestionTypes.fill_in_the_blank.id &&
                    <><span>This Question type is not supported yet. Please choose a different one.</span></>
                }
            </CardBody>
            <CardFooter className="flex flex-row items-center gap-4"> 

                <Button 
                    color="primary" 
                    startContent={<Icon filled  >{integrity ? "check" : "save"}</Icon>} 
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