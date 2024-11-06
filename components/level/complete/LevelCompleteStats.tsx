"use client";

import { motion } from "framer-motion";
import { Count } from "react-price-animation";

import { Card, CardContent } from "@/components/ui/card"
import Icon from "@/components/utils/Icon"

import { formatSeconds } from "@/functions/helpers"

import { framerListAnimationProps } from "@/lib/utils";

export default function LevelCompleteStats({ xp, seconds, accuracy, type } : { xp: number, seconds: number, accuracy: number, type: string }) {

    return (
        <>
        <motion.h1 
            {...framerListAnimationProps}
            custom={0}
            className=" w-full text-center text-4xl font-bold  "
        >
            {type == "level" ? "Level" : "Training"} Complete!
        </motion.h1>
        <div  className="flex flex-col gap-4"  >
            <motion.div           
                {...framerListAnimationProps}
                custom={1}>

                <Card className=" w-full py-2  border light:border-success dark:border-success text-success font-bold text-lg">
                    <CardContent className="flex flex-row items-center w-full justify-between py-4">
                        <span className=" text-success">Stars found</span>
                        <div className="flex items-center gap-1">
                            <Icon color="success" filled>hotel_class</Icon>
                            <Count number={xp} />
                        </div>
                        
                    </CardContent>
                </Card>

            </motion.div>

            <motion.div           
                {...framerListAnimationProps}
                custom={2}>
                <Card className=" w-full py-2 border light:border-success dark:border-warning text-warning font-bold text-lg">
                    <CardContent className="flex flex-row items-center w-full justify-between py-4">
                        <span className=" text-warning ">Time</span>
                        <div className="flex items-center gap-1">
                            <Icon color="warning" filled>timer</Icon>
                            <div className="flex flex-row items-center">
                                <Count number={formatSeconds(seconds).minutes} />
                                <span>:</span>
                                <Count number={formatSeconds(seconds).seconds} />
                            </div>
                        
                        </div>
                    </CardContent>
                </Card>
            </motion.div>


            <motion.div           
                {...framerListAnimationProps}
                custom={3}>
                <Card className=" w-full py-2 border light:border-success dark:border-danger text-danger font-bold text-lg">
                    <CardContent className="flex flex-row items-center w-full justify-between py-4">
                        <span className=" text-danger ">Accuracy</span>
                        <div className="flex items-center gap-1">
                            <Icon color="danger" filled>crisis_alert</Icon>
                            <div className="flex flex-row items-center">
                                <Count number={Math.round(accuracy)} />
                                <span>%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

        </div>
        </>
    )
}