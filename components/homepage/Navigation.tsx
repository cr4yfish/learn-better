
import React from "react"
import Icon from "../Icon"

import Link from "next/link"

const LinkComponent = ({ href, icon, active } : { href: string, icon: string, active: boolean }) => {
    return (
        <Link
            href={href}
            className="flex items-center justify-center w-fit h-fit scale-150"
        >
            <Icon filled={active}>
                {icon}
            </Icon>
        </Link>
    )
}

export default function Navigation() {

    return (
        <>
        <div className=" absolute bottom-0 bg-black/50 z-50 backdrop-blur-xl rounded-t-xl flex justify-between items-center w-full p-6">
            <div className="flex items-center justify-evenly w-full gap-4">
                <LinkComponent href="/" icon="home" active={true} />
                <LinkComponent href="/training" icon="exercise" active={true} />
                <LinkComponent href="/leaderboard" icon="leaderboard" active={true} />
                <LinkComponent href="/user" icon="account_circle" active={true} />
            </div>
        </div>
        </>
    )

}