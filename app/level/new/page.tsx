"use server";

import Link from "next/link";
import { Button } from "@/components/utils/Button";

import Icon from "@/components/utils/Icon";

import LevelNewMain from "@/components/level/new/LevelNewMain";


export default async function NewLevel() {

    return (
        <>
        <div className="flex flex-col gap-4 px-4 py-6">
            <div className="flex flex-row items-center gap-4">
                <div className=" w-fit">
                    <Link href="/">
                        <Button 
                            isIconOnly 
                            variant="light"
                        >
                            <Icon filled>arrow_back</Icon>
                        </Button>
                    </Link>
                </div>
                <h1 className=" font-bold text-4xl w-full">Add a new Level</h1>
            </div>

            <LevelNewMain />

            
        </div>
        
        </>
    )
}