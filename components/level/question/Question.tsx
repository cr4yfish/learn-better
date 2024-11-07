import React, { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { useStopwatch } from "react-use-precision-timer";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";
import { motion } from "framer-motion";

import { Question as QuestionType } from "@/types/db";
import { SessionState } from "@/types/auth";
import { Correct, LevelState, Match, MatchCardsState } from "@/types/client";
import { QuestionState, OptionState } from "@/types/client";
import { Button } from "@/components/utils/Button";
import Option from "./Option";
import BlurModal from "@/components/utils/BlurModal";
import { addUserQuestion } from "@/utils/supabase/questions";
import Icon from "@/components/utils/Icon";
import { shuffleArray, areArraysEqual } from "@/utils/functions/helpers";
import QuestionReportButton from "./QuestionReportButton";
import { addExplainAnswerTokens } from "@/utils/supabase/user";
import { useToast } from "@/hooks/use-toast";

import { framerListAnimationProps } from "@/utils/utils";

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
        answers: question.answers_correct,
        selected: [],
        correct: "initial"
    })
    const [matchCardsState, setMatchCardsState] = useState<MatchCardsState>({
        options: [...question.answer_options, ...question.answers_correct],
        matches: []
    })
    
    const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

    const [switchingQuestion, setSwitchingQuestion] = useState(false);
    const stopwatch = useStopwatch();
    const { toast } = useToast();

    const { messages, handleSubmit, setInput, isLoading: isMistralLoading, setMessages } = useChat({
        keepLastMessageOnError: true,
        api: "/api/ai/questionHelper",
        initialInput: "",
        onFinish: async (m, { usage }) => {
            setIsExplained(true);

            // add tokens to explain answer
            try {
                if(!session?.profile) throw new Error("User profile not found");
                await addExplainAnswerTokens(session.profile, usage.totalTokens);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Could not add tokens to explain answer",
                    variant: "destructive"
                })
            }
        }
    });
    const [isExplained, setIsExplained] = useState(false);
    
    // update prompt
    useEffect(() => {

        let answerOptions = questionState.selected;

        if(question.type.title == "Fill in the blank") {
            answerOptions = question.answers_correct.map((word) => {
                if(question.answer_options.includes(word) && !questionState.selected.includes(word)) {
                    return "";
                } else {
                    return word;
                }
            })
        }

        const newInput = `
            Please explain the correct answer and if my answer is wrong, then also why it is wrong. 
            The Question Title: ${question.title}. 
            The Question Description: ${question.question}. 
            The Correct Answer Options: [${question.answers_correct.join(", ")}].
            All the Answer Options: [${question.answer_options.join(", ")}]. 
            The Question Type: ${question.type.title}.
            The Answers options I chose: [${answerOptions.join(", ")}]
        `
        setInput(newInput)
        console.log(newInput);
    }, [
        question, setInput, questionState
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

    
    const handleNextQuestion = () => {
        setIsLoading(true);
        setSwitchingQuestion(true);

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
                setSwitchingQuestion(false);
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

        setTimeout(() => {
            setSwitchingQuestion(false);
        }, 100);
        
    }

    // shuffle the options when the question changes
    useEffect(() => {
        const randomOptions = shuffleArray(question.answer_options)
        const randomAnswers = shuffleArray(question.answers_correct)
        setQuestionState((prevState) => ({
            ...prevState,
            options: randomOptions,
            answers: randomAnswers
        }))
    }, [question.answer_options])

    // reset the question state when the question changes
    useEffect(() => {
        setQuestionState((prevState) => ({
            ...prevState,
            selected: [],
            correct: "initial"
        }))

        setMatchCardsState((prevState) => ({
            ...prevState,
            matches: []
        }))

        setCurrentMatch(null);

        setMessages([])
    }, [question.answers_correct])

    const handleCheckAnswer = async () => {

        if(!session) {
            alert("You must be logged in to answer questions");
            return;
        }

        setIsLoading(true)

        stopwatch.pause();

        let xp = 0;
        let completed = false;
        let accuracy = 0;

        if(question.type.title == "Multiple Choice" || question.type.title == "Boolean") {
            if (areArraysEqual(question.answers_correct, questionState.selected)) {
                xp = 100;
                completed = true;
                accuracy = 100;
            }         
        } else if(question.type.title == "Match the Cards"){
            if(matchCardsState.matches.length == question.answer_options.length) {
                const numCorrect = matchCardsState.matches.filter(match => match.correct == "correct").length;

                accuracy = Math.round((numCorrect / question.answer_options.length) * 100);

                if(numCorrect == question.answer_options.length) {
                    xp = 100;
                    completed = true;
                }
            }
        } else if(question.type.title == "Fill in the blank") {
            const correct = question.answers_correct;
            const selected = questionState.selected;
            
            completed = true;
            let numCorrect = 0;

            correct.forEach((word, index) => {
                if(!selected[index]) return;

                if(selected[index] == word) {
                    console.log("hit")
                    numCorrect++; 
                } else {
                    console.log("wrong!", word, index, selected[index])
                    completed = false;
                }
            })

            accuracy = Math.round((numCorrect / question.answer_options.length) * 100);

            if(completed) {
                xp = 100;
            }

        } 
        
        else {
            // unknown question type
            console.error("Unknown question type", question.type.title)
            return;
        }

        if(completed) {
            setQuestionState({...questionState, correct: "correct"})
        } else {
            setQuestionState({...questionState, correct: "wrong"})
        }

        await addUserQuestion({
            try_id: uuidv4(),
            user: session.user?.id as string,
            question: question.id,
            completed: completed,
            xp: xp,
            accuracy: accuracy,
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

    // Multiple Choice & Boolean type question

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
        
        const getOptionStateMultipleChoice = (questionState: QuestionState, option: string): OptionState => {

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

    //
    
    // Match the Cards type question
        
        const getOptionStateMatchCards = (option: string): OptionState => {

            if(matchCardsState.matches.length != 0) {
                
                const match = matchCardsState.matches.find(match => (match.option == option || match.match == option));

                if(match) {
                    if(match.correct == "initial") {
                        return "selected";
                    } 
                    if(match.correct == "correct") {
                        return "correct";
                    }
                    if(match.correct == "wrong") {
                        return "wrong";
                    }
                }
            }

            if(!currentMatch) return "unselected";

            if(currentMatch.option == option || currentMatch.match == option) {

                if(currentMatch.correct == "initial") {
                    return "selected";
                } 
         
                if(currentMatch.correct == "correct") {
                    return "correct";
                }
    
                if(currentMatch.correct == "wrong") {
                    return "wrong";
                }   
    
            }

            return "unselected";
            
        }

        const handleSelectMatch = (match: string) => {
            if(!currentMatch) return;

            const matchIndex = question.answers_correct.indexOf(match);
            const optionIndex = question.answer_options.indexOf(currentMatch.option);

            let correct: Correct = "wrong";

            if(matchIndex === optionIndex) {
                correct = "correct";
            }

            const newMatch: Match = {
                option: currentMatch.option,
                match: match,
                correct: correct
            }

            setMatchCardsState((prevState) => {
                return {
                    ...prevState,
                    matches: [...prevState.matches, newMatch]
                }
            })

            setCurrentMatch((prevState) => {
                if(prevState == null) return {
                    option: currentMatch.option,
                    match: match,
                    correct: correct
                }

                return {
                    ...prevState,
                    match: match,
                    correct: correct
                }
            })

        }
    
        useEffect(() => {
            if(matchCardsState.matches.length == question.answer_options.length) {
                setTimeout(() => {
                    handleCheckAnswer();
                }, 500);
            }
        }, [matchCardsState])

    //

    // Fill in the blank type question

        const handleFill = (option: string) => {

            const newSelected = questionState.selected;

            if(newSelected.length == 0) {
                newSelected.length = question.answers_correct.length;
                const firstOptionsIndex = question.answers_correct.findIndex((word) => question.answer_options.includes(word))
                newSelected[firstOptionsIndex] = option;
            } else {
                const nextIndex = question.answers_correct.findIndex((word, index) => question.answer_options.includes(word) && !newSelected[index])
                newSelected[nextIndex] = option;
            }
            

            setQuestionState((prevState) => {
                return {
                    ...prevState,
                    selected: newSelected
                }
            })
        }

        const handleRemoveFill = (index: number) => {
            const newSelected = questionState.selected;
            newSelected[index] = "";
            setQuestionState((prevState) => {
                return {
                    ...prevState,
                    selected: newSelected
                }
            })
        }
    
    //

    return (
        <>
        <div className="flex flex-col prose dark:prose-invert gap-6 overflow-visible pb-20">
            <div className="flex flex-col gap-1">
                <p className=" m-0">{question.title}</p>
                <h2 className="m-0 font-bold">{question.question}</h2>
            </div>

            <div className="flex flex-col gap-2 overflow-visible">
                <span className=" text-tiny">{question?.type?.title == "Multiple Choice" ? `Choose ${question.answers_correct.length} options` : question.type.description}</span>
                
                {!switchingQuestion && question.type.title == "Multiple Choice" && question.answer_options.map((option: string, index: number) => (
                    <motion.div 
                        {...framerListAnimationProps}
                        custom={index}
                        key={index}
                    >
                        <Option 
                            state={getOptionStateMultipleChoice(questionState, option)}
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
                    </motion.div>
                ))}

                {!switchingQuestion && question.type.title == "Match the Cards" && (
                    <div className="flex flex-row justify-between items-center gap-2">

                        <div className="flex flex-col w-[45%] gap-2">
                            {questionState.options?.map((option: string, index: number) => (
                                <motion.div 
                                    {...framerListAnimationProps}
                                    custom={index}
                                    key={index}
                                >
                                    <Option 
                                        state={getOptionStateMatchCards(option)}
                                        setQuestionState={() => {
                                            setCurrentMatch({ option: option, match: "", correct: "initial" })
                                        }}
                                        key={index}
                                        active={matchCardsState.matches.find(match => (match.option == option) && match.correct != "initial") == undefined }
                                        isDisabled={matchCardsState.matches.find(match => match.option == option) != undefined}
                                    >
                                        {option}
                                    </Option>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col w-[45%] gap-2">
                            {questionState.answers?.map((option: string, index: number) => (
                                <motion.div
                                    {...framerListAnimationProps}
                                    custom={index}
                                    key={index}
                                >
                                    <Option
                                        state={getOptionStateMatchCards(option)}
                                        setQuestionState={() => {
                                            handleSelectMatch(option)
                                        }}
                                        key={index}
                                        isDisabled={matchCardsState.matches.find(match => match.match == option) != undefined}
                                        active={currentMatch?.option !== undefined}
                                        >
                                        {option}
                                    </Option>
                                </motion.div>    
                            ))}
                        </div>

                    </div>
                )}
                
                {!switchingQuestion && question.type.title == "Fill in the blank" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row flex-wrap gap-1">
                            {question.answers_correct.map((answer: string, index: number) => (
                                question.answer_options.includes(answer) ?
                                (<motion.span 
                                    key={index}
                                    id={answer}
                                    layout
                                    layoutId={answer}
                                    {...framerListAnimationProps}
                                    custom={index}
                                >
                                    <Button 
                                        size="sm" 
                                        color="secondary"
                                        variant="flat"
                                        onClick={() => handleRemoveFill(index)}
                                    >
                                        {questionState.selected[index]}
                                    </Button>
                                </motion.span>) :
                                (<motion.span 
                                    key={index}
                                    {...framerListAnimationProps}
                                    custom={index}
                                >
                                    {answer}
                                </motion.span>)
                            ))}
                        </div>

                        
                        <div className="flex flex-row flex-wrap gap-2">
                            {questionState.options.map((option: string, index: number) => (
                                !questionState.selected.includes(option) &&
                                <motion.div
                                    id={option}
                                    layout
                                    layoutId={option}
                                    {...framerListAnimationProps}
                                    custom={index}
                                    key={index}
                                >
                                    <Button
                                        variant="flat" color="secondary" size="sm"
                                        isDisabled={questionState.selected.includes(option)}
                                        onClick={() => handleFill(option)}
                                    >
                                        {option}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                )}

                {question.type.title == "Boolean" && (
                    <>
                    <motion.div
                        {...framerListAnimationProps}
                        custom={0}
                        className="w-full"
                    >
                        <Option
                            size="lg"
                            state={getOptionStateMultipleChoice(questionState, "True")}
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
                        >
                            Statement is <b>True</b>
                        </Option>
                    </motion.div>

                    <motion.div
                        {...framerListAnimationProps}
                        custom={1}
                        className="w-full"
                    >
                        <Option
                            size="lg"
                            state={getOptionStateMultipleChoice(questionState, "False")}
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
                        >
                            Statement is <b>False</b>
                        </Option>
                    </motion.div>
                    </>
                )}

            </div>
            
            { !switchingQuestion && question.type.title != "Match the Cards" &&
                <motion.div
                {...framerListAnimationProps}
                    custom={question.answer_options.length +1}
                    className="w-full"
                >
                    <Button 
                        color={questionState.correct == "initial" ? "primary" : (questionState.correct == "correct" ? "success" : "danger")}
                        isDisabled={
                                questionState.selected.length == 0 || 
                                questionState.correct != "initial" || 
                                (question.type.title == "Fill in the blank" &&
                                    (questionState.selected.filter((word) => word !== "").length != question.answers_correct.filter((q) => question.answer_options.includes(q)).length)
                                )
                        }
                        isLoading={isLoading}
                        size="lg"
                        fullWidth
                        onClick={handleCheckAnswer}
                    >
                        {questionState.correct == "initial" ? "Check Answer" : (questionState.correct == "correct" ? "Correct!" : "Wrong!")}
                    </Button>
                </motion.div>
            }
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