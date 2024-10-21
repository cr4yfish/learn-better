
import Link from "next/link";
import { Progress } from "@nextui-org/progress";
import { Button } from "@/components/utils/Button";

import Icon from "../../utils/Icon";
import Xp from "../../utils/Xp";

export default function QuestionHeader({ progress, xp, numQuestions, show } : { progress: number, xp: number, numQuestions: number, show: boolean }) {

    return (
        <>
        { show &&
            <div className="flex flex-row gap-2 items-center justify-center w-full">
            <Link href="/"><Button isIconOnly variant="light"><Icon>close</Icon></Button></Link>
            <div className="flex flex-col gap-1 items-center justify-center w-full">
                <Progress value={progress} maxValue={numQuestions} color={progress == numQuestions ? "success" : "primary"} />
            </div>
            <Xp xp={xp} isLoaded={true} />
        </div>
        }
        </>
    )

}