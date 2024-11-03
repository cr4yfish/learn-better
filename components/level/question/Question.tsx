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
import { areArraysEqual as arraysAreEqual, shuffleArray } from "@/functions/helpers";
import QuestionReportButton from "./QuestionReportButton";

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
        selected: [],
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
    
    // update prompt
    useEffect(() => {
        setInput(`Please explain the correct answer and if my answer is wrong, then also why it is wrong. The Question Title: ${question.title}. The Question Description: ${question.question}. The Correct Answer Options: [${question.answers_correct.join(", ")}]. All the Answer Options: [${question.answer_options.join(", ")}]. The Answers options I chose: [${questionState.selected.join(", ")}]`)
    }, [
        question.title, question.question, question.answer_options,
        question.answers_correct, questionState.selected, setInput
    ])

    // restart time when question changes
    useEffect(() => {
        stopwatch.stop();
        stopwatch.start();
        return () => { stopwatch.stop() }
    }, [question.question, stopwatch])

    // start the timer
    useEffect(() => {
        stopwatch.start();

        // cleanup
        return () => {
            stopwatch.stop();
        }
    }, [stopwatch])

    // shuffle the options when the question changes
    useEffect(() => {
        const randomOptions = shuffleArray(question.answer_options)
        setQuestionState((prevState) => ({
            ...prevState,
            options: randomOptions
        }))
    }, [question.answer_options])

    // reset the question state when the question changes
    useEffect(() => {
        setQuestionState((prevState) => ({
            ...prevState,
            selected: [],
            correct: "initial"
        }))

        setMessages([])
    }, [question.answers_correct])

    // de-select options when selecting more than the correct number of options
    useEffect(() => {
        if(questionState.selected.length > question.answers_correct.length) {
            const newSelected = questionState.selected;
            newSelected.shift();
            setQuestionState((prevState) => ({
                ...prevState,
                selected: newSelected
            }))
        }
    }, [question.answers_correct, questionState.selected])
    
    const handleCheckAnswer = async () => {

        if(!session) {
            alert("You must be logged in to answer questions");
            return;
        }

        setIsLoading(true)

        stopwatch.pause();

        let xp = 0;
        let completed = false;

        if (arraysAreEqual(question.answers_correct, questionState.selected)) {
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

        if(questionState.correct == "initial" && questionState.selected.includes(option)) { 
            return "selected";
        } 
        else if(questionState.correct == "correct" && questionState.selected.includes(option)) {
            return "correct";
        }
        else if(questionState.correct == "wrong" && questionState.selected.includes(option)) {
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

    return (
        <>
        <div className="flex flex-col prose dark:prose-invert gap-6 overflow-visible pb-20">
            <div className="flex flex-col gap-1">
                <p className=" m-0">{question.title}</p>
                <h2 className="m-0 font-bold">{question.question}</h2>
            </div>

            <div className="flex flex-col gap-2 overflow-visible">
                <span className=" text-tiny">{question?.type?.title == "Multiple Choice" ? `Choose ${question.answers_correct.length} options` : question.type.description}</span>
                {question.type.title == "Multiple Choice" && question.answer_options.map((option: string, index: number) => (
                    <Option 
                        state={getOptionState(questionState, option)}
                        setQuestionState={() => setQuestionState((prevState) => {
                            if(prevState.selected.includes(option)) {
                                return {
                                    ...prevState,
                                    selected: prevState.selected.filter(selectedOption => selectedOption != option)
                                }
                            } else {
                                return {
                                    ...prevState,
                                    selected: [...prevState.selected, option]
                                }
                            }
                        })}
                        key={index}
                        active={questionState.correct == "initial"}
                        >
                        {option}
                    </Option>
                ))}
                
                {question.type.title == "Boolean" && (
                    <>
                    <Option
                        size="lg"
                        state={getOptionState(questionState, "True")}
                        setQuestionState={() => setQuestionState((prevState) => {
                            if(prevState.selected.includes("True")) {
                                return {
                                    ...prevState,
                                    selected: prevState.selected.filter(selectedOption => selectedOption != "True")
                                }
                            } else {
                                return {
                                    ...prevState,
                                    selected: ["True"]
                                }
                            }
                        })}
                        active={questionState.correct == "initial"}
                    >Statement is <b>True</b></Option>
                    <Option
                        size="lg"
                        state={getOptionState(questionState, "False")}
                        setQuestionState={() => setQuestionState((prevState) => {
                            if(prevState.selected.includes("False")) {
                                return {
                                    ...prevState,
                                    selected: prevState.selected.filter(selectedOption => selectedOption != "False")
                                }
                            } else {
                                return {
                                    ...prevState,
                                    selected: ["False"]
                                }
                            }
                        })}
                        active={questionState.correct == "initial"}
                    >Statement is <b>False</b></Option>
                    </>
                )}

            </div>

            <Button 
                color={questionState.correct == "initial" ? "primary" : (questionState.correct == "correct" ? "success" : "danger")}
                isDisabled={questionState.selected.length == 0 || questionState.correct != "initial"}
                isLoading={isLoading}
                size="lg"
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
            header={
                <>
                {questionState.correct == "correct" ? "Correct!" : "Wrong!"}
                <QuestionReportButton question={question} userId={session?.user?.id} />
                </>
            }
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
                <div className="flex flex-col w-full gap-2">
                    <form onSubmit={handleSubmit} className=" w-full">
                        <Button 
                            isLoading={isMistralLoading} 
                            isDisabled={isExplained} type="submit" 
                            color="secondary" variant="bordered" 
                            size="lg"
                            fullWidth
                            startContent={<Icon filled>auto_awesome</Icon>}
                        >
                            Explain answer
                        </Button>
                    </form>
                    <Button isLoading={isLoading} size="lg" color="primary" onClick={handleNextQuestion}>Next Question</Button>
                </div>
            }
        />


        </>
    )
}