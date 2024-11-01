"use client";

import { useState } from "react";

import { Weak_User_Questions } from "@/types/db";


import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "../ui/card";

type Params = {
    weakQuestions: Weak_User_Questions[];
}

export default function ViewWeakQuestions(params: Params) {
  const [isModalOpen, setIsModalOpen] = useState(false);


    return (
    <>
        <Button 
            startContent={<Icon filled>list</Icon>} 
            size="lg" 
            className="w-[150px]" 
            onClick={() => setIsModalOpen(true)} 
            variant="flat"
        >
            View
        </Button>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "full"
            }}
            header={<>Weak Questions</>}
            body={
                <>
                    <div className="flex flex-col gap-4">
                        {params.weakQuestions.map((q, i) => (
                            <Card key={i} >
                                <CardHeader>
                                    <CardDescription>{q.question.question}</CardDescription>
                                    <CardTitle>{q.question.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-gray-700 dark:text-gray-300">{Math.round(q.score)} Score</span>
                                </CardContent>
                                
                            </Card>
                        ))}
                    </div>
                </>
            }
            footer={
                <>

                </>
            }
        />
    </>
  );
}