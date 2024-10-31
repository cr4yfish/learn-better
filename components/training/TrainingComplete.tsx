
import LevelCompleteStats from "../level/complete/LevelCompleteStats"
import { Training } from "@/types/db"

export default function TrainingComplete({ training } : { training: Training }) {

    if(!training.xp || !training.seconds || !training.accuracy) return <></>

    return (
        <>
        <div className="flex flex-col gap-4 w-full items-center justify-evenly">
            <LevelCompleteStats xp={training.xp} seconds={training.seconds} accuracy={training.accuracy} />

        </div>
        </>
    )
}