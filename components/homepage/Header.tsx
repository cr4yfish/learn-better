"use client";

import React from "react";
import { Button } from "@nextui-org/button"

import Streak from "../Streak"
import Xp from "../Xp"
import { Course } from "@/types/db";

export default function Header({ 
    currentCourse, onOpen } : { 
        currentCourse?: Course, courses?: Course[], onOpen: () => void }) {
    

    return (
        <>
        <div className="flex flex-col justify-center items-center w-full p-6">
            <div className="flex flex-row items-center justify-evenly flex-nowrap gap-5 backdrop-blur w-full">
                <Button 
                    variant="bordered" color="primary"
                    className="font-black" onClick={() => {
                        console.log("Opening modal");
                        onOpen();
                    }} 
                >
                    {currentCourse?.abbreviation}
                </Button>
                <Streak streak={365} />
                <Xp xp={2000} />
            </div>
        </div>
 
        </>
    )
}