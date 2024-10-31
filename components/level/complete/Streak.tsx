

export default async function LevelCompleteStreak({ streakDays } : { streakDays: number }) {

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <span 
                style={{
                    fontSize: "128pt",
                    textShadow: "0px 0px 100px rgba(255, 165, 0, 0.5)",
                    transform: "translateY(120px)"
                }}
                className="material-symbols-rounded material-symbols-filled  text-orange-400"
                >
                    mode_heat
            </span>
            <span 
                style={{
                }}
                className="text-[128pt] m-0 font-black z-20 h-[200px]">{streakDays}</span>
            <span className=" text-2xl font-bold">day streak</span>
        </div>
    )
}