"use client";

import React from "react";
import { Button } from "@nextui-org/button"

import Streak from "../Streak"
import Xp from "../Xp"
import { User_Course } from "@/types/db";

export default function Header({ 
    currentUserCourse, onOpen } : { 
        currentUserCourse?: User_Course, onOpen: () => void }) {
    

    return (
        <>
        <div className="flex flex-col justify-center items-center w-full p-6">
            <div className="flex flex-row items-center justify-evenly flex-nowrap gap-5 backdrop-blur w-full">
                <Button 
                    variant="bordered" color="primary"
                    className="font-black" 
                    onClick={() => {
                        onOpen();
                    }} 
                    isLoading={!currentUserCourse?.course?.abbreviation}
                >
                    {currentUserCourse?.course?.abbreviation}
                </Button>
                <Streak streak={365} />
                <Xp xp={2000} />
            </div>
        </div>
 
        </>
    )
}