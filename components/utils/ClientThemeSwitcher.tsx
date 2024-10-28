"use client"; 

import { useEffect } from "react";
import { Settings } from "@/types/db";

import { theme } from "@/functions/helpers";

/**
 * This component is used to switch the theme on the client side
 * @param param0 
 * @returns 
 */
export default function ClientThemeSwitcher({ settings } : { settings: Settings }) {

    useEffect(() => {
        theme.setDarkMode(settings.theme_is_dark);
    }, [settings]);

    // Doesnt render anything
    return (
        <>
        </>
    )
}