"use client";

import { framerListAnimationProps } from "@/utils/utils";
import { motion } from "framer-motion";

import LevelVoteButton from "./LevelVoteButton";
import { Session } from "@supabase/supabase-js";

type Props = {
    params: {
        id: string;
    },
    session: Session;
}

export default function LevelCompleteVote(props: Props) {

    return (
        <>
        <div className="flex flex-col w-full items-center justify-center">
            <motion.h1 {...framerListAnimationProps} custom={0} className=" text-4xl font-bold text-center w-full">Liked the Level?</motion.h1>
            <motion.p  {...framerListAnimationProps} custom={1} className=" text-gray-700 dark:text-gray-400 ">Voting helps out the creator</motion.p>
        </div>
        <motion.div
            {...framerListAnimationProps}
            custom={2}
        >
            <LevelVoteButton userId={props.session.user.id} levelId={props.params.id} />
        </motion.div>
        </>
    )
}