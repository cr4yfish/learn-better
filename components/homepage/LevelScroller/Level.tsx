"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import { Topic } from "@/types/db";
import { Button } from "@/components/Button";
import ConditionalLink from "@/components/ConditionalLink";
import Icon from "@/components/Icon"

export default function Level({ topic, active, offset, isAdmin=false } : { topic: Topic, active: boolean, offset: number, isAdmin?: boolean }) {
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
                >
                    {!active && <p className=" text-gray-200 "></p>}
                    <Icon upscale filled color={active ? "white" : "gray-200"} >grade</Icon>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-2 p-4">
                    <h2 className="text-lg font-semibold">{topic.title}</h2>
                    <p className="text-sm">{!active ? "Unlock all levels above to unlock this" : topic.description}</p>
                    <div className="flex flex-row gap-1 items-center w-full">
                        <ConditionalLink active={active} href={`/level/${topic.id}`}>
                            <Button 
                                className={` w-full ${active ? "bg-white text-primary font-bold" : "font-bold"}`}
                                color={active ? "primary" : "default"} 
                                variant="shadow"
                                fullWidth
                                isDisabled={!active}
                            >
                                {!active ? "Locked" : topic.completed ? "Review +100 XP" : "Start"}
                            </Button>
                        </ConditionalLink>
                        {isAdmin && (
                            <Link href={`/level/edit/${topic.id}`}>
                                <Button color="warning" variant="flat" isIconOnly >
                                    <Icon color="warning" filled>edit</Icon>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
        </div>
    )
}