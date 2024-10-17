import Link from "next/link"
import React from "react"

import Icon from "../Icon"

type Links = "Home" | "Training" | "Community" | "Profile" | "Leaderboard"

const LinkComponent = ({ href, icon, activeTitle, title } : { href: string, icon: string, activeTitle: string, title: Links }) => {
    const active: boolean = activeTitle === title
    
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center w-fit h-fit scale-150"
        >
            <Icon filled={active} color={active ? "white" : "slate-400"} >
                {icon}
            </Icon>
            <span className={` text-[0.5rem] ${active ? "text-white" : "text-slate-400"}`}>{title}</span>
        </Link>
    )
}

export default function Navigation({ activeTitle } : { activeTitle: Links }) {

    return (
        <>
        <div className=" absolute bottom-0 bg-black/50 z-50 backdrop-blur-xl rounded-t-xl flex justify-center items-center w-full p-6">
            <div className="flex items-center justify-evenly w-full max-w-[960px] gap-4">
                <LinkComponent title="Home" href="/" icon="home" activeTitle={activeTitle} />
                <LinkComponent title="Leaderboard" href="/leaderboard" icon="leaderboard" activeTitle={activeTitle} />
                <LinkComponent title="Training" href="/training" icon="exercise" activeTitle={activeTitle} />
                <LinkComponent title="Community" href="/community" icon="communities" activeTitle={activeTitle} />
                <LinkComponent title="Profile" href="/user" icon="account_circle" activeTitle={activeTitle} />
            </div>
        </div>
        </>
    )

}