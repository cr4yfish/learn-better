"use client";

import { framerListAnimationProps } from "@/lib/utils";
import { motion } from "framer-motion";

export default  function LevelCompleteRank({ rankTitle } : { rankTitle: string }) {

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.span {...framerListAnimationProps} custom={0} className="text-[24pt] font-bold ">You ranked up!</motion.span>
            <motion.span {...framerListAnimationProps} custom={1} className="text-[50pt] font-bold ">{rankTitle}</motion.span>
            <motion.span {...framerListAnimationProps} custom={2} className="text-[16pt] ">New rank</motion.span>
        </div>
    )
}