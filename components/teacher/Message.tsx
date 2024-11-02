"use client";

import Markdown from "react-markdown";
import { motion } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";

type MessageProps = {
    message: string;
    role: "function" | "data" | "system" | "user" | "assistant" | "tool"
}

export default function Message(props: MessageProps) {


    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={
                `w-full flex items-center 
                ${props.role == "user" && "justify-end"}
                ${props.role == "assistant" && "justify-start"}
            `}
        >
            <Card className=" h-fit min-h-fit w-fit rounded-3xl">
                {props.role !== "user" &&
                    <CardHeader className="pb-1">
                        <CardTitle className=" text-primary" >{props.role == "assistant" && "Teacher"}</CardTitle>
                    </CardHeader>
                }
                <CardContent className={`${props.role == "user" && "pt-2 pb-2"} flex w-full justify-end`}>
                    <Markdown className={"prose dark:prose-invert"}>{props.message}</Markdown>
                </CardContent>
                { props.role === "assistant" &&
                    <CardFooter className="pt-0">
                        <p className=" text-tiny text-gray-700 dark:text-gray-300">Messages by the Teacher can include incorrect information</p>
                    </CardFooter>
                }
            </Card>
        </motion.div>
    )
}