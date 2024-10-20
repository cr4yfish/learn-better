"use client"

import { Card, CardBody } from "@nextui-org/card"

import Icon from "../utils/Icon"

import { User_Topic } from "@/types/db"
import { Spinner } from "@nextui-org/spinner"
import { formatSeconds } from "@/functions/helpers"

export default function LevelComplete({ userTopic, isLoading } : { userTopic: User_Topic, isLoading: boolean }) {

    return (
        <>
        <div className="flex flex-col gap-4 w-full items-center justify-evenly">

            <Card className=" w-full py-2 bg-success/15 text-success font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Stars found</span>
                    {isLoading ? <Spinner color="success" size="sm" /> :
                    <div className="flex items-center gap-1">
                        <Icon color="success" filled>hotel_class</Icon>
                        {userTopic.xp}
                    </div>
                    }
                </CardBody>
            </Card>

            <Card className=" w-full py-2 bg-warning/15 text-warning font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Time</span>
                    {isLoading ? <Spinner color="warning" size="sm" /> :
                    <div className="flex items-center gap-1">
                        <Icon color="warning" filled>timer</Icon>
                        {formatSeconds(userTopic.seconds)}
                    </div>}
                </CardBody>
            </Card>

            <Card className=" w-full py-2 bg-danger/15 text-danger font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Accuracy</span>
                    {isLoading ? <Spinner color="danger" size="sm" /> :
                    <div className="flex items-center gap-1">
                        <Icon color="danger" filled>crisis_alert</Icon>
                        {userTopic.accuracy}%
                    </div>}
                </CardBody>
            </Card>

        </div>
        </>
    )
}