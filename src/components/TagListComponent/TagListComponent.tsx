import React from 'react';
import style from './TagListComponent.module.css';
import { TAGS } from "../../constants/tags";

interface TagListComponentProps {
    selectedTags: string[];  // Масив вибраних тегів
    handleTagClick: (tag: string) => void;
    letterTags?: string[]; // Додаємо опціональний пропс для тегів з листа
}

const TagListComponent: React.FC<TagListComponentProps> = ({ selectedTags, handleTagClick, letterTags }) => {
    const tagsToDisplay = letterTags && letterTags.length > 0 ? letterTags : TAGS; // Якщо є letterTags, виводимо їх, інакше всі теги

    return (
        <div className={style.tagList}>
            {tagsToDisplay.map((tag) => (
                <div
                    key={tag}
                    className={`${style.tagBadge} ${selectedTags.includes(tag) ? style.selected : ''}`}
                    onClick={() => handleTagClick(tag)}
                >
                    {tag}
                </div>
            ))}
        </div>
    );
};

export default TagListComponent;