"use client";

import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/utils/Button"
import Icon from "@/components/utils/Icon"
import { framerListAnimationProps } from "@/lib/utils";

type Props = {
    type: "level" | "training";
    id: string;
    next: "stats" | "battle" | "rank" | "vote" | "done";
    rankUp?: boolean;
    listNumber: number;
}

export default function LevelCompleteContinueButton(props: Props) {

    return (
        <motion.div
            {...framerListAnimationProps}
            custom={props.listNumber}
        >
        <Link href={props.next == "done" ? "/" : `/complete/${props.type}/${props.id}/${props.next}?rankUp=${props.rankUp ?? false}`}>
            <Button fullWidth size="lg" color="primary" variant="shadow" endContent={<Icon>arrow_right_alt</Icon>}>Continue</Button>
        </Link>
        </motion.div>
    )
}