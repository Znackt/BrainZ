export interface Iconprops {
    size: "xs" | "sm" | "md" | "lg" | "xl",
    onClick?: () => void;
}

export const sizeVariants = {
    "xs": "size-3",
    "sm": "size-4",
    "md": "size-5",
    "lg": "size-6",
    "xl": "size-7",
}