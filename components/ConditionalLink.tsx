import React from "react"
import Link from "next/link"

export default function ConditionalLink({ children, href, active } : { children: React.ReactNode, href: string, active: boolean }) {
    if(active) {
        return (
            <Link
                href={href}
            >
                {children}
            </Link>
        )
    } else {
        return (
            <>
            {children}
            </>
        )
    }
}