
import Link from "next/link";
import { Progress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";

import Icon from "../Icon";
import Xp from "../Xp";

export default function Header({ progress, xp, numQuestions } : { progress: number, xp: number, numQuestions: number }) {

    return (
        <>
            { progress !== numQuestions &&
                <div className="flex flex-row gap-2 items-center justify-center w-full">
                <Link href="/"><Button isIconOnly variant="light"><Icon>close</Icon></Button></Link>
                <div className="flex flex-col gap-1 items-center justify-center w-full">
                    <Progress value={progress} maxValue={numQuestions} color={progress == numQuestions ? "success" : "primary"} />
                </div>
                <Xp xp={xp} />
            </div>
            }
        </>
    )

}