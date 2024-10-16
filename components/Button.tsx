import { Button as NextUIButton } from "@nextui-org/button"

export function Button({
    children,
    className,
    onClick,
    type,
    variant,
    size,
    isLoading,
    isDisabled,
    color,
    startContent,
    endContent,
    isIconOnly,
    fullWidth,
    radius
} : {
    children: React.ReactNode,
    className? : string | undefined,
    onClick? : () => void,
    type?: "button" | "submit" | "reset",
    variant?: "light" | "solid" | "bordered" | "flat" | "faded" | "shadow" | "ghost" | undefined,
    size?: "sm" | "md" | "lg" | undefined,
    isLoading?: boolean,
    isDisabled?: boolean,
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger",
    startContent?: React.ReactNode,
    endContent?: React.ReactNode,
    isIconOnly?: boolean,
    fullWidth?: boolean,
    radius?: "none" | "sm" | "md" | "lg" | "full" | undefined
}) {

    return (
        <>
        <NextUIButton
            className={` font-black ${color == "primary" && "text-fuchsia-950"} ${className}`}
            onClick={onClick}
            type={type}
            variant={variant}
            size={size}
            isLoading={isLoading}
            isDisabled={isDisabled}
            color={color}
            startContent={startContent}
            endContent={endContent}
            isIconOnly={isIconOnly}
            fullWidth={fullWidth}
            radius={radius}
        >
            {children}
        </NextUIButton>
        </>
    )
}