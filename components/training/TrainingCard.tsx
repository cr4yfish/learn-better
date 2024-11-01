import { Training } from "@/types/db"

import { Card, CardHeader, CardDescription, CardContent } from "../ui/card"
import Icon from "../utils/Icon"

type Params = {
    training: Training
}

export default function TrainingCard(params: Params) {


    return (
        <>
        <Card>
            <CardHeader>
                <CardDescription>
                    {new Date(params.training.created_at ?? "").toLocaleDateString()}
                </CardDescription>
                
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-evenly">
                <div className="flex items-center gap-1">
                    <Icon>crisis_alert</Icon>
                    <span>{params.training.accuracy}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Icon>schedule</Icon>
                    <span>{params.training.seconds}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Icon>hotel_class</Icon>
                    <span>{params.training.xp}</span>
                </div>
            </CardContent>
        </Card>
        </>
    )
} 