"use client";

import { Card, CardBody } from "@nextui-org/card"
import Icon from "../Icon"
import { Skeleton } from "@nextui-org/skeleton";

type OptionState = "selected" | "unselected" | "correct" | "wrong"


export default function Option(
    { children, state, setState, active } : 
    { 
        children: React.ReactNode,
        state: OptionState
        setState: any,
        active: boolean
    }) {
    
    return (
        <Card
            isPressable
            onPress={() => active && setState(!(state == "selected"))}
            className={`
                flex flex-row items-center justify-start gap-2 
                ${state == "selected" ? "bg-primary-500 text-white" : ""}
                ${state == "correct" ? "bg-green-500 text-white" : ""}
                ${state == "wrong" ? "bg-red-500 text-white" : ""}
            `}
        >
            <CardBody className="flex flex-row items-center justify-start gap-2">
                <Icon filled={state == "selected"}>check_circle</Icon>
                <span>{children}</span>
            </CardBody>
        </Card>
    )

}