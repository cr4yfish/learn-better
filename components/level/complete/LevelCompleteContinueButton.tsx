
import Link from "next/link"

import { Button } from "@/components/utils/Button"
import Icon from "@/components/utils/Icon"

type Params = {
    type: "level" | "training";
    id: string;
    next: "stats" | "battle" | "rank" | "vote" | "done";
    rankUp?: boolean;
}

export default function LevelCompleteContinueButton(params: Params) {

    return (
        <>
        <Link href={params.next == "done" ? "/" : `/complete/${params.type}/${params.id}/${params.next}?rankUp=${params.rankUp ?? false}`}>
            <Button fullWidth size="lg" color="primary" variant="shadow" endContent={<Icon>arrow_right_alt</Icon>}>Continue</Button>
        </Link>
        </>
    )
}