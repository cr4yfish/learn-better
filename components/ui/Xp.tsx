import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@nextui-org/button";

import Icon from "./Icon"

export default function Xp({ xp, isLoaded } : { xp?: number, isLoaded: boolean }) {

    return (
        <>
        <Skeleton isLoaded={isLoaded} className="rounded-full">
            <Button 
                variant="light"
                startContent={<Icon filled color="green-500" >hotel_class</Icon>}
                className="flex items-center justify-center gap-2"
            >
                <div className="text-2xl font-semibold text-green-500 ">{xp?.toLocaleString() ?? 0}</div>
            </Button>
        </Skeleton>
        </>
    )
}