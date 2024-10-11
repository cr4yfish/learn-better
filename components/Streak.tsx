
import Icon from "./Icon";

export default function Streak({ streak } : { streak: number }) {
    return (
        <>
        <div className="flex items-center justify-center gap-2">
            <Icon filled color="red-400">mode_heat</Icon>
            <div className="text-2xl font-semibold text-red-400">{streak}</div>
        </div>
        </>
    )
}