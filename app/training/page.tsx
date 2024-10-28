"use server";

import { Button } from "@/components/utils/Button";
import Navigation from "@/components/utils/Navigation"
import { getWeakQuestions } from "@/utils/supabase/questions";


export default async function Training() {

    const weakQuestions = await getWeakQuestions();
    
    return (
        <>
        <div className=" px-4 py-6 flex flex-col gap-4">
            <h1 className=" font-bold">Training</h1>
            <span>Weak Questions : {weakQuestions.length}</span>
            <Button isDisabled color="primary" variant="shadow">Train</Button>
        </div>
        
        <Navigation activeTitle="Training" />
        </>
    )
}