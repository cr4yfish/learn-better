
import { Card, CardContent } from "@/components/ui/card"
import Icon from "@/components/utils/Icon"

import { formatSeconds } from "@/functions/helpers"

export default function LevelCompleteStats({ xp, seconds, accuracy } : { xp: number, seconds: number, accuracy: number }) {

    return (
        <>
            <Card className=" w-full py-2  border light:border-success dark:border-success text-success font-bold text-lg">
                <CardContent className="flex flex-row items-center w-full justify-between py-4">
                    <span className=" text-success">Stars found</span>
                    <div className="flex items-center gap-1">
                        <Icon color="success" filled>hotel_class</Icon>
                        {xp}
                    </div>
                    
                </CardContent>
            </Card>

            <Card className=" w-full py-2 border light:border-success dark:border-warning text-warning font-bold text-lg">
                <CardContent className="flex flex-row items-center w-full justify-between py-4">
                    <span className=" text-warning ">Time</span>
                    <div className="flex items-center gap-1">
                        <Icon color="warning" filled>timer</Icon>
                        {formatSeconds(seconds)}
                    </div>
                </CardContent>
            </Card>

            <Card className=" w-full py-2 border light:border-success dark:border-danger text-danger font-bold text-lg">
                <CardContent className="flex flex-row items-center w-full justify-between py-4">
                    <span className=" text-danger ">Accuracy</span>
                    <div className="flex items-center gap-1">
                        <Icon color="danger" filled>crisis_alert</Icon>
                        {Math.round(accuracy)}%
                    </div>
                </CardContent>
            </Card>

        </>
    )
}