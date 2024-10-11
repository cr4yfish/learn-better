import React from "react";

import "@material-symbols/font-400";

export default function Icon({ children, color, filled, upscale } : { children: React.ReactNode, color?: string, filled?: boolean, upscale?: boolean }) {
    return (
        <span 
            className={"material-symbols-rounded prose dark:prose-invert text-5xl" + (color ? ` text-${color}` : "") + (filled ? " material-symbols-filled " : "") + (upscale ? "scale-125" : "")}
        >
            {children}
        </span>
    )
}