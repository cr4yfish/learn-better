"use server";

import { redirect } from "next/navigation";
import Link from "next/link";

import { Question, Topic } from "@/types/db";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/ui/Icon";
import LevelEditMain from "@/components/level/edit/LevelEditMain";

import { getQuestions } from "@/utils/supabase/questions";
import { getTopic } from "@/utils/supabase/topics";


export default async function EditLevel({ params: { level } }: { params: { level: string } }) {

    let topic: Topic | null = null;

    try {
        topic = await getTopic(level);
    } catch (error) {
        console.error(error);
        redirect("/404");
    }

    let questions: Question[] = [];

    try {
        questions = await getQuestions(topic.id);
    } catch (error) {
        console.error(error);
    }

    return (
        <>
        <div className="px-4 py-6 flex flex-col gap-4 overflow-y-scroll h-fit min-h-full">
            <div className="flex flex-row flex-nowrap items-center gap-4">
                <Link href="/">
                    <Button isIconOnly variant="light">
                        <Icon filled>arrow_back</Icon>
                    </Button>
                </Link>
                <h1 className=" font-bold text-2xl">{topic.title}</h1>
            </div>


            <LevelEditMain
                initTopic={topic}
                initQuestions={questions}
            />

        </div>

        </>
    )
}