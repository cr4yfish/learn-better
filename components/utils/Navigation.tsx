"use server";

import Link from "next/link"
import React from "react"

import Icon from "../utils/Icon"

type Links = "Home" | "Training" | "Community" | "Profile" | "Leaderboard"

const LinkComponent = ({ href, icon, activeTitle, title } : { href: string, icon: string, activeTitle: string | undefined, title: Links }) => {
    const active: boolean = (activeTitle && (activeTitle === title)) || false;
    
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center w-fit h-fit scale-150"
        >
            <Icon filled={active} color={active ? "primary" : "primary"} darkColor={active ? "primary" : "gray-400"} >
                {icon}
            </Icon>
            <span className={` text-[0.5rem] ${active ? "light:text-fuchsia-800 dark:text-white" : "light:text-gray-600 dark:text-gray-400"}`}>{title}</span>
        </Link>
    )
}

export default async function Navigation({ activeTitle } : { activeTitle: Links | undefined }) {

    return (
        <>
        <div className=" absolute bottom-0 light:bg-white/50 dark:bg-black/50 z-50 backdrop-blur-xl rounded-t-xl flex justify-center items-center w-full p-6">
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