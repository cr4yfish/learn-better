"use client";

import { Card, CardBody } from "@nextui-org/card"
import Icon from "../../utils/Icon"
import React from "react";

import { OptionState } from "@/types/client";

export default function Option(
    { children, state, setQuestionState, active, size="md" } : 
    { 
        children: React.ReactNode,
        state: OptionState
        setQuestionState: (state: boolean) => void,
        active: boolean,
        size?: "md" | "lg"
    }) {
    
    return (
        <Card
            isPressable
            fullWidth
            onPress={() => active && setQuestionState(!(state == "selected"))}
            className={`
                flex flex-row items-center justify-start gap-2 border dark:border-primary/15 text-gray-500 dark:text-gray-300
                ${state == "selected" ? "bg-fuchsia-500 text-white" : ""}
                ${state == "correct" ? "bg-green-500 text-white" : ""}
                ${state == "wrong" ? "bg-red-500 text-white" : ""}
                ${state == "unselected" ? "bg-gray-100 dark:bg-primary/10" : ""}
                ${size == "lg" && "py-6"}
            `}

        >
            <CardBody className="flex flex-row items-center justify-start py-6 gap-2">
                <Icon filled={state !== "unselected"} color={state == "unselected" ? "dark:text-gray-300" : "inherit"} >check_circle</Icon>
                <span>{children}</span>
            </CardBody>
        </Card>
    )

}