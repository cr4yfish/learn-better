import React from "react";

import "@material-symbols/font-400";

export default function Icon(
    { children, color="inherit", filled, upscale, downscale } : 
    { children: React.ReactNode, color?: string, filled?: boolean, upscale?: boolean, downscale?: boolean }) {
    return (
        <span 
            className={
                "material-symbols-rounded prose dark:prose-invert text-tiny" 
                + (color ? ` text-${color}` : "") 
                + (filled ? " material-symbols-filled " : "") 
                + (upscale ? "scale-125" : "") + (downscale ? "scale-75" : "")
            }
        >
            {children}
        </span>
    )
}