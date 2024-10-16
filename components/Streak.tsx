
import Icon from "./Icon";

export default function Streak({ streak, streakHanging } : { streak: number, streakHanging: boolean }) {
    return (
        <>
        <div className="flex items-center justify-center gap-2">
            <Icon 
                filled 
                color={`${streakHanging ? "neutral-600" : "orange-400"}`}
            >
                mode_heat
            </Icon>
            <div 
                className={`text-2xl font-semibold ${streakHanging ? "text-neutral-600" : "text-orange-400"}`}
            >
                {streak}
            </div>
        </div>
        </>
    )
}