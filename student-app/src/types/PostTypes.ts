export interface PostProps {
    _id: string;
    text: string;
    images: { compressed: string, original: string }[];
    status: string;
    createdAt: string;
}