"use client";


import { useChat } from "ai/react";
import { FormEvent, useRef } from "react";

import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Input } from "@nextui-org/input";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import Message from "./Message";
import { Course, Profile } from "@/types/db";
import { Spinner } from "@nextui-org/spinner";

type TeacherAIProps = {
    course: Course,
    userProfile: Profile,
}

export default function TeacherChat(props: TeacherAIProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        keepLastMessageOnError: true,
        api: "/api/ai/teacher",
        initialMessages: [
            {
                id: "1",
                role: "system",
                content: `
                The user is: ${props.userProfile.username}. The user needs help with the course: ${props.course.title}.
                Here is all the information you have about the course:
                ${JSON.stringify(props.course, null, 2)}.

                Roleplay as a teacher of that course. Do not break your role.
                ` ,
            }
        ],
        onFinish: () => {
            if(scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth"
                })
            }
        }
    })

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(isLoading) return;
        handleSubmit(e);
        inputRef.current?.focus();
    }

    return (
        <>
        
        <ScrollShadow ref={scrollRef} className={`flex flex-col gap-2 min-h-[150px] h-[100%] relative overflow-y-scroll pb-[110px]`}>
            {messages.map(message => (
                (message.role == "user" || message.role == "assistant") && <Message key={message.id} message={message.content} role={message.role} />
            ))}
            {messages.length === 0 && (
                <div className="text-center text-gray-500">Chat with TeacherAI</div>
            )}
        </ScrollShadow>

        <form onSubmit={handleFormSubmit} className="absolute bottom-0 left-0 w-full flex flex-col items-start justify-center gap-1 px-4 pb-5">
            {isLoading &&
                <div className="flex flex-row gap-1 items-center ml-4">
                    <Spinner size="sm" />
                    <span className="text-tiny font-light ">Teacher is writing</span>
                </div>
            }
            
            <Input 
                radius="full" 
                ref={inputRef}
                name="prompt"
                size="lg"
                value={input}
                onChange={handleInputChange}
                label="Chat with TeacherAI" 
                endContent={<Button isLoading={isLoading} type="submit" isIconOnly radius="full" color="primary"><Icon>send</Icon></Button>} 
                classNames={{
                    inputWrapper: "px-2 pl-4",
                }}
            />
        </form>

        </>
    )
}