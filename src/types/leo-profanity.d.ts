declare module 'leo-profanity' {
    const leoProfanity: {
        check: (text: string) => boolean;
        clean: (text: string) => string;
        add: (words: string[]) => void;
        addAll: () => void;
        remove: (words: string[]) => void;
        removeAll: () => void;
        list: () => string[];
    };

    export default leoProfanity;
}