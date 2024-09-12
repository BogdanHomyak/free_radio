export interface ILetterModel {
    id: string;
    age?: string;
    senderName: string;
    senderRegion: string;
    letterText: string;
    tags: string[];
    dataProcessingConsent: boolean;
    photos?: string[];
    likes: number;
    likedBy: string[];
    createdAt?: Date;
}