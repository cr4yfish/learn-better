"use server";


export default async function LevelCompleteRank({ rankTitle } : { rankTitle: string }) {

    return (
        <div className="flex flex-col items-center justify-center gap-4">
        <span className="text-[24pt] font-bold ">You ranked up!</span>
        <span className="text-[50pt] font-bold ">{rankTitle}</span>
        <span className="text-[16pt] ">New rank</span>
    </div>
    )
}