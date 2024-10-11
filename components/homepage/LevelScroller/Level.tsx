"use client";

import { useState } from "react"
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import Icon from "../../Icon"
import Link from "next/link";
import { Topic } from "@/types/db";
import ConditionalLink from "@/components/ConditionalLink";
import { Tooltip } from "@nextui-org/tooltip";

export default function Level({ topic, active, offset } : { topic: Topic, active: boolean, offset: number }) {
    const [isPressed, setIsPressed] = useState(false)
    return (
        <div
            style={{
                transform: `translateX(${offset}rem)`,
            }}
        >
        <Popover 
            showArrow
            className="dark"
            color={active ? "primary" : "default"}
        >
            <PopoverTrigger>
                <Button 
                    className={` w-20 h-20 ${!active && "bg-gray-800"}`}
                    radius="full"
                    variant={active ? "shadow" : "flat"}
                    size="lg"
                    isIconOnly
                    color={topic.completed ? "primary" :  active ? "primary" : "default"}
                    onMouseDown={() => setIsPressed(true)} 
                    onMouseUp={() => setIsPressed(false)} 
                >
                    {!active && <p className=" text-gray-200 "></p>}
                    <Icon upscale filled color={active ? "white" : "gray-200"} >grade</Icon>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-2 p-4">
                    <h2 className="text-lg font-semibold">{topic.title}</h2>
                    <p className="text-sm">{!active ? "Unlock all levels above to unlock this" : topic.description}</p>
                    <ConditionalLink active={active} href={`/level/${topic.id}`}>
                        <Button 
                            className={active ? "bg-white text-primary font-bold" : "font-bold"}
                            color={active ? "primary" : "default"} 
                            variant="shadow"
                            fullWidth
                            isDisabled={!active}
                        >
                            {!active ? "Locked" : topic.completed ? "Review +100 XP" : "Start"}
                        </Button>
                    </ConditionalLink>
                </div>
            </PopoverContent>
        </Popover>
        </div>
    )
}