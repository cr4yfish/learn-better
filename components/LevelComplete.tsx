"use client"

import { Card, CardBody } from "@nextui-org/card"

import Icon from "./Icon"

import { User_Topic } from "@/types/db"

export default function LevelComplete({ userTopic } : { userTopic: User_Topic }) {

    return (
        <>
        <div className="flex flex-col gap-4 w-full items-center justify-evenly">

            <Card className=" w-full py-2 bg-green-500/20 text-green-300 font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Stars found</span>
                    <div className="flex items-center gap-1">
                        <Icon color="green-300" filled>hotel_class</Icon>
                        {userTopic.xp}
                    </div>
                </CardBody>
            </Card>

            <Card className=" w-full py-2 bg-blue-500/20 text-blue-300 font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Time</span>
                    <div className="flex items-center gap-1">
                        <Icon color="blue-300" filled>timer</Icon>
                        {userTopic.seconds}
                    </div>
                </CardBody>
            </Card>

            <Card className=" w-full py-2 bg-pink-500/20 text-pink-300 font-bold text-lg">
                <CardBody className="flex flex-row items-center w-full justify-between">
                    <span>Accuracy</span>
                    <div className="flex items-center gap-1">
                        <Icon color="pink-300" filled>crisis_alert</Icon>
                        {userTopic.accuracy}%
                    </div>
                </CardBody>
            </Card>

        </div>
        </>
    )
}