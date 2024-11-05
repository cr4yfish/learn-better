"use client";

import { Textarea } from "@nextui-org/input";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";

import { Question } from "@/types/db";
import { useEffect, useState } from "react";

type Props = {
    question: Question;
    handleUpdateValue: (key: keyof Question, value: string | string[]) => void;
    handleOptionValueChange: (value: string, index: number) => void;
}

export default function EditFillBlank({ question, handleUpdateValue }: Props) {
    const [selectMode, setSelectMode] = useState(false);
    const [text, setText] = useState(question.answers_correct.join(" "));

    const handleRemoveBlank = (word: string) => {
        handleUpdateValue("answer_options", question.answer_options.filter((o) => o != word));
    }

    const handleAddBlank = (word: string) => {
        handleUpdateValue("answer_options", [...question.answer_options, word]);
    }

    const handleToogleBlank = (word: string) => {
        
        // If the word is already in the answer options, remove it
        if(question.answer_options.includes(word)) {
            handleRemoveBlank(word);
        } else {
            handleAddBlank(word);
        }
    }
    
    // keep the answers_correct in sync with the text
    useEffect(() => {
        handleUpdateValue("answers_correct", text.split(" "));
    }, [text])


    return (
        <div className="flex flex-col gap-1">
            <span className=" font-semibold">Options</span>
        
            { !selectMode &&
                <Textarea 
                    value={text}
                    onValueChange={setText}
                    label="The complete text"
                    description="Enter the complete text of the question"
                />
            }

            { selectMode &&
                <div className="flex flex-col">
                    <p>Click on the words, which should be blanks</p>
                    <div className="flex flex-row flex-wrap gap-1">
                        {text.split(" ").map((word, index) => (
                            <Button 
                                onClick={() => handleToogleBlank(word)}
                                variant={question.answer_options.includes(word) ? "solid" : "light"}
                                key={index} 
                            >
                                {word}
                            </Button>
                        ))}
                    </div>
                </div>
            }
            
            <div className="mt-1">
                <Button 
                    color="warning" 
                    variant="light" 
                    startContent={<Icon color="warning" filled>mode</Icon>}
                    onClick={() => setSelectMode(!selectMode)}
                >
                    Switch select mode
                </Button>
            </div>
        </div>
    )
}