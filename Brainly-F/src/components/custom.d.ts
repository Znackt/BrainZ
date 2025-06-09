export interface CardProps {
    title: string,
    link: string,
    type: "twitter" | "youtube" | "notion" | "image" | "video" | "audio",
    description?: string,
    contentId?: string,
}