
import { User_Topic } from "@/types/db"
import LevelCompleteStats from "./complete/LevelCompleteStats"

export default function LevelComplete({ userTopic } : { userTopic: User_Topic }) {

    return (
        <>
        <div className="flex flex-col gap-4 w-full items-center justify-evenly relative z-50">

            <LevelCompleteStats 
                xp={userTopic.xp}
                seconds={userTopic.seconds}
                accuracy={userTopic.accuracy}
            />

        </div>
        </>
    )
}