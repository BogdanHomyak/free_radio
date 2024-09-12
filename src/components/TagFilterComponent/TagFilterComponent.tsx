import React, { useState } from 'react';
import style from './TagFilterComponent.module.css';
import TagListComponent from '../TagListComponent/TagListComponent';
import { sortOptions } from "../../constants/sortOptions";

interface TagFilterProps {
    onFilterChange: (selectedTags: string[], selectedSort: string) => void;
}

const TagFilterComponent: React.FC<TagFilterProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // Множинний вибір тегів
    const [sortOpen, setSortOpen] = useState(false); // Для відкриття сортування
    const [selectedSort, setSelectedSort] = useState('За популярністю'); // Вибір сортування

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (sortOpen) setSortOpen(false);
    };

    const toggleSortDropdown = () => {
        setSortOpen(!sortOpen);
        if (isOpen) setIsOpen(false);
    };

    const handleTagClick = (tag: string) => {
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter((selectedTag) => selectedTag !== tag)
            : [...selectedTags, tag];

        setSelectedTags(updatedTags);
        onFilterChange(updatedTags, selectedSort); // Передаємо нові теги та сортування
    };

    const handleSortClick = (sortOption: string) => {
        setSelectedSort(sortOption);
        setSortOpen(false);
        onFilterChange(selectedTags, sortOption); // Передаємо теги та нове сортування
    };

    return (
        <div className={style.tagFilterContainer}>
            <div className={style.filterContainer}>
                <div className={style.filterHeader} onClick={toggleDropdown}>
                    <span>Обрати район</span>
                    {isOpen ? (
                        <svg className={style.svg} xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="black" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg className={style.svg} xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                            <path d="M1 9L5 5L1 1" stroke="black" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                {/* Додатковий фільтр "За популярністю" */}
                <div className={style.filterHeader} onClick={toggleSortDropdown}>
                    <span>{selectedSort}</span>
                    {sortOpen ? (
                        <svg className={style.svg} xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="black" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg className={style.svg} xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                            <path d="M1 9L5 5L1 1" stroke="black" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
            </div>
            <div>
                {isOpen && (
                    <TagListComponent selectedTags={selectedTags} handleTagClick={handleTagClick} /> // Передаємо масив тегів
                )}
            </div>
            <div>
                {sortOpen && (
                    <ul className={style.sortList}>
                        {sortOptions.map(option => (
                            <li key={option.value} onClick={() => handleSortClick(option.label)}>
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TagFilterComponent;