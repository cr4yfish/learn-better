import Icon from "../components/Icon"

export default function Xp({ xp } : { xp: number }) {

    return (
        <>
        <div className="flex items-center justify-center gap-2">
            <Icon filled color="green-500" >hotel_class</Icon>
            <div className="text-2xl font-semibold text-green-500 ">{xp}</div>
        </div>
        </>
    )
}