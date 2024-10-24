import React, { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { useStopwatch } from "react-use-precision-timer";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";

import { Question as QuestionType } from "@/types/db";
import { SessionState } from "@/types/auth";
import { LevelState } from "@/types/client";
import { QuestionState, OptionState } from "@/types/client";
import { Button } from "@/components/utils/Button";
import Option from "./Option";
import BlurModal from "@/components/utils/BlurModal";
import { addUserQuestion } from "@/utils/supabase/questions";
import Icon from "@/components/utils/Icon";
import { shuffleArray } from "@/functions/helpers";


export default function Question({
    question, setLevelState, session, levelState, questions
} : {
    question: QuestionType,
    setLevelState: React.Dispatch<React.SetStateAction<LevelState>>,
    session?: SessionState,
    levelState: LevelState,
    questions: QuestionType[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [questionState, setQuestionState] = useState<QuestionState>({
        options: question.answer_options,
        selected: "",
        correct: "initial"
    })
    const stopwatch = useStopwatch();

    const { messages, handleSubmit, setInput, isLoading: isMistralLoading, setMessages } = useChat({
        keepLastMessageOnError: true,
        api: "/api/ai/questionHelper",
        initialInput: "",
        onFinish: () => {
            setIsExplained(true)
        }
    });
    const [isExplained, setIsExplained] = useState(false);
    
    useEffect(() => {
        setInput(`Please explain why the correct answer and why my answer is wrong. The Question Title: ${question.title}. The Question Description: ${question.question}. The Correct Answer: ${question.answer_correct}. All the Answer Options: ${question.answer_options.join(", ")}. The wrong Answer I chose: ${questionState.selected}`)
    }, [
            question.title, question.question, question.answer_options,
            question.answer_correct, questionState.selected, setInput
        ])

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
        
        await addUserQuestion({
            try_id: uuidv4(),
            user: session.user?.id as string,
            question: question.id,
            completed: completed,
            xp: xp,
            accuracy: completed ? 100 : 0,
            seconds: Math.round(stopwatch.getElapsedRunningTime()/1000),
            last_tried_at: new Date().toISOString()
        })

        stopwatch.stop(); // reset the timer
        
        setLevelState((prevState) => ({
            ...prevState,
            progress: prevState.progress + 1,
            totalQuestions: completed ? prevState.totalQuestions : ++prevState.totalQuestions,
            xp: prevState.xp + xp,
            correctQuestions: completed ? ++prevState.correctQuestions : prevState.correctQuestions,
            questions: prevState.questions.map(q => q.id == question.id ? { id: q.id, completed: completed } : q),
            answeredQuestions: ++prevState.answeredQuestions,
        }))

        setIsModalOpen(true)
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
        
        // get next question
        const nextQuestion = questions.at(levelState.currentQuestionIndex + 1);

        // check for completion, otherwise just increment the current question index
        // end of questions is handled by the parent component
        if(!nextQuestion) {
            // check for completion
            const firstUncompleted = levelState.questions.find(q => !q.completed);
            if(firstUncompleted) {
                // set the current question index to the first uncompleted question
                setLevelState((prevState) => ({
                    ...prevState,
                    currentQuestionIndex: questions.indexOf(questions.find(q => q.id == firstUncompleted.id) as QuestionType),
                }))
                setIsLoading(false);
                setIsModalOpen(false);
                setIsExplained(false);
                return;
            }
        } 

        setLevelState((prevState) => ({
            ...prevState,
            currentQuestionIndex: ++prevState.currentQuestionIndex,
        }))
        setIsModalOpen(false);
        setIsLoading(false);
        setIsExplained(false);
    }

    useEffect(() => {
        stopwatch.start();

        // cleanup
        return () => {
            stopwatch.stop();
        }
    }, [stopwatch])

    useEffect(() => {
        const randomOptions = shuffleArray(question.answer_options)
        setQuestionState((prevState) => ({
            ...prevState,
            options: randomOptions
        }))
    }, [question.answer_options])

    useEffect(() => {
        // reset the question state when the question changes
        setQuestionState((prevState) => ({
            ...prevState,
            selected: "",
            correct: "initial"
        }))

        setMessages([])
    }, [question.answer_correct])

    return (
        <>
        <div className="flex flex-col prose dark:prose-invert gap-6">
            <div className="flex flex-col gap-1">
                <p className=" m-0">{question.title}</p>
                <h2 className="m-0 font-bold">{question.question}</h2>
            </div>

            <div className="flex flex-col gap-2">
                <span className=" text-tiny">{question?.type?.description}</span>
                {question.answer_options.map((option: string, index: number) => (
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
                onClick={handleCheckAnswer}
            >
                    {questionState.correct == "initial" ? "Check Answer" : (questionState.correct == "correct" ? "Correct!" : "Wrong!")}
            </Button>
        </div>

        <BlurModal
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen} 
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                isDismissable: false,
                hideCloseButton: true,
            }}
            header={<>{questionState.correct == "correct" ? "Correct!" : "Wrong!"}</>}
            body={
                <div className=" min-h-full">
                    <span>{questionState.correct == "correct" ? "You got it right!" : "You got it wrong!"}</span>
                    {messages.map(message => (
                        <div key={message.id}>
                            {message.role == "assistant" && (
                                <div className="flex flex-col gap-1 h-fit prose dark:prose-invert prose-p:mt-0">
                                    <span className="mb-0 font-medium">Explanation</span>
                                    <Markdown>{message.content}</Markdown>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            }
            footer={
                <div className="flex items-center justify-between gap-2">
                    <form onSubmit={handleSubmit}>
                        <Button 
                            isLoading={isMistralLoading} 
                            isDisabled={isExplained} type="submit" 
                            color="secondary" variant="flat" 
                            startContent={<Icon filled>auto_awesome</Icon>}
                        >
                            Explain answer
                        </Button>
                    </form>
                    <Button isLoading={isLoading} color="primary" onClick={handleNextQuestion}>Next Question</Button>
                </div>
            }
        />


        </>
    )
}