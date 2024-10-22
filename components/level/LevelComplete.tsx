import { Card, CardBody } from "@nextui-org/card"

import Icon from "../utils/Icon"

import { User_Topic } from "@/types/db"
import { formatSeconds } from "@/functions/helpers"

export default function LevelComplete({ userTopic } : { userTopic: User_Topic }) {

    return (
        <>
        <div className="flex flex-col gap-4 w-full items-center justify-evenly">

            <Card className=" w-full py-2 bg-success/15 text-success font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Stars found</span>
                    <div className="flex items-center gap-1">
                        <Icon color="success" filled>hotel_class</Icon>
                        {userTopic.xp}
                    </div>
                    
                </CardBody>
            </Card>

            <Card className=" w-full py-2 bg-warning/15 text-warning font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Time</span>
                    <div className="flex items-center gap-1">
                        <Icon color="warning" filled>timer</Icon>
                        {formatSeconds(userTopic.seconds)}
                    </div>
                </CardBody>
            </Card>

            <Card className=" w-full py-2 bg-danger/15 text-danger font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Accuracy</span>
                    <div className="flex items-center gap-1">
                        <Icon color="danger" filled>crisis_alert</Icon>
                        {Math.round(userTopic.accuracy)}%
                    </div>
                </CardBody>
            </Card>

        </div>
        </>
    )
}