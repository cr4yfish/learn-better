"use client";

import { Input } from "@nextui-org/input";

import Icon from "@/components/ui/Icon";
import { Button } from "@/components/utils/Button";

import { Question } from "@/types/db";


export default function EditMatchCards(
    { question, handleUpdateValue, handleOptionValueChange } 
    : 
    { question: Question, handleUpdateValue: (key: keyof Question, value: string | string[]) => void , handleOptionValueChange: (value: string, index: number) => void}
) {
    
    const handleCorrectAnswerChange = (value: string, index: number) => {
        if(question.answers_correct.length < index + 1) {
            // fill index with empty strings up to the index
            const newAnswers = [...question.answers_correct];
            for(let i = newAnswers.length; i < index; i++) {
                newAnswers.push("");
            }
            newAnswers.push(value);
            handleUpdateValue("answers_correct", newAnswers);
        }
        else {
            // update the value at the index, leave rest alone
            handleUpdateValue("answers_correct", question.answers_correct.map((a, i) => i == index ? value : a));
        }
    }
    
    return (
        <>
        <div className="flex flex-col gap-1">
            <span className=" font-semibold">Options</span>
            {question.answer_options?.map((option, index) => (
                <div
                    key={index}
                    className="flex flex-row gap-1"
                >
                    <Input 
                        key={index} 
                        label={`Option ${index + 1}`} 
                        placeholder="Enter the option" 
                        value={option} 
                        onValueChange={(value) => handleOptionValueChange(value, index)}
                        endContent={(
                            <div className="flex flex-row items-center gap-1">
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
                    <Input 
                        label={`Match ${index + 1}`}
                        placeholder="Enter the match"
                        value={question.answers_correct[index]}
                        onValueChange={(value) => handleCorrectAnswerChange(value, index)}
                    />
                </div>
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
        </>
    )
}