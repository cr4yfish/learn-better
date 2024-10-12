import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { useStopwatch } from "react-use-precision-timer";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure} from "@nextui-org/modal";

import { Question as QuestionType } from "@/types/db";
import { SessionState } from "@/types/auth";
import { LevelState } from "@/types/client";
import { QuestionState, OptionState } from "@/types/client";

import Option from "./Option";

import { addUserQuestion } from "@/functions/client/supabase";

export default function Question({
    question, setLevelState, session
} : {
    question: QuestionType,
    setLevelState: React.Dispatch<React.SetStateAction<LevelState>>,
    session?: SessionState
}) {
    const { onOpen, onOpenChange, isOpen} = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [questionState, setQuestionState] = useState<QuestionState>({
        options: question.answer_options,
        selected: "",
        correct: "initial"
    })
    const stopwatch = useStopwatch();
    
    const handleCheckAnswer = async () => {

        if(!session) {
            alert("You must be logged in to answer questions");
            return;
        }

        setIsLoading(true)

        stopwatch.pause();

        let xp = 0;
        let completed = false;

        if (questionState.selected == question.answer_correct) {
            setQuestionState({...questionState, correct: "correct"})
            xp = 100;
            completed = true;
        } else {
            setQuestionState({...questionState, correct: "wrong"})
        }            
        
        const res = await addUserQuestion({
            user: session.user?.id as string,
            question: question.id,
            completed: completed,
            tries: 1,
            xp: xp,
            accuracy: questionState.correct == "correct" ? 1 : 0,
            seconds: stopwatch.getElapsedRunningTime()
        })

        console.log(res);

        stopwatch.stop(); // reset the timer

        setLevelState((prevState) => ({
            ...prevState,
            progress: prevState.progress + 1,
            xp: xp
        }))

        onOpen()
        setIsLoading(false)
    }

    const getOptionState = (questionState: QuestionState, option: string): OptionState => {

        if(questionState.correct == "initial" && questionState.selected == option) {
            return "selected";
        } 
        else if(questionState.correct == "correct" && questionState.selected == option) {
            return "correct";
        }
        else if(questionState.correct == "wrong" && questionState.selected == option) {
            return "wrong";
        }

        return "unselected"
    }

    const handleNextQuestion = () => {
        setIsLoading(true);
        setLevelState((prevState) => ({
            ...prevState,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            answeredQuestions: ++prevState.answeredQuestions,
        }))
        setIsLoading(false);
    }

    useEffect(() => {
        stopwatch.start();

        // cleanup
        return () => {
            stopwatch.stop();
        }
    }, [stopwatch])

    return (
        <>
        <div className="flex flex-col prose dark:prose-invert gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-bold m-0">{question.title}</h1>
                <p className="m-0">{question.question}</p>
            </div>

            <div className="flex flex-col gap-2">
                <span className=" text-tiny">{question?.type?.description}</span>
                {[...question.answer_options, question.answer_correct].map((option: string, index: number) => (
                    <Option 
                        state={getOptionState(questionState, option)}
                        setQuestionState={() => setQuestionState({...questionState, selected: option})}
                        key={index}
                        active={questionState.correct == "initial"}
                        >
                        {option}
                        </Option>
                ))}
                
            </div>

            <Button 
                color={questionState.correct == "initial" ? "primary" : (questionState.correct == "correct" ? "success" : "danger")}
                isDisabled={questionState.selected.length == 0 || questionState.correct != "initial"}
                isLoading={isLoading}
                onPress={handleCheckAnswer}
            >
                    {questionState.correct == "initial" ? "Check Answer" : (questionState.correct == "correct" ? "Correct!" : "Wrong!")}
            </Button>
        </div>

        <Modal hideCloseButton isDismissable={false} isKeyboardDismissDisabled  className="dark" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>{questionState.correct == "correct" ? "Correct!" : "Wrong!"}</ModalHeader>
                <ModalBody>
                    {questionState.correct == "correct" ? "You got it right!" : "You got it wrong!"}
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={isLoading} className="w-full" color="primary" onPress={handleNextQuestion}>Next Question</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}