"use client";

import { Weak_User_Questions } from "@/types/db";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";

import { createTrainingLevel } from "@/app/training/actions";

export default function TrainButton({ weakQuestions } : { weakQuestions: Weak_User_Questions[] }) {
    return (
        <Button 
            startContent={<Icon filled>exercise</Icon>} 
            fullWidth size="lg" color="primary" variant="shadow"
            onClick={() => createTrainingLevel(weakQuestions)}
        >
            Train
        </Button>
    )
}