"use client";

import { framerListAnimationProps } from "@/lib/utils";
import { Battle, Profile } from "@/types/db";
import { motion } from "framer-motion";

import Battles from "@/components/training/Battles";

type Props = {
    userId : string;
    userProfile : Profile;
    battles : Battle[];
}

export default function LevelCompleteBattles(props: Props) {

    return (
        <>
        <motion.h1 
            {...framerListAnimationProps}
            custom={0}
            className=" w-full text-center text-4xl font-bold  "
        >
            Your Battles
        </motion.h1>
        <motion.div
            {...framerListAnimationProps}
            custom={1}
        >
            <Battles battles={props.battles} userId={props.userId} showButtons={false} userProfile={props.userProfile} />
        </motion.div>
        </>
    )
}