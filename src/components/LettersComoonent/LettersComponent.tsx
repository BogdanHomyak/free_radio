import React, { useEffect, useState } from 'react';
import { fetchFilteredLetters } from '../../services/firestoreService';  // Використовуємо функцію з фільтрами і пагінацією
import { ILetterModel } from '../../models/ILetterModel';
import DemoLetterCard from "../DemoLetterCard/DemoLetterCard";
import style from './LettersComponent.module.css';

interface LettersComponentProps {
    filters: {
        tags: string[],
        sort: string
    };
    onCardClick: (letterId: string) => void;
}

const LettersComponent: React.FC<LettersComponentProps> = ({ filters, onCardClick }) => {
    const [letters, setLetters] = useState<ILetterModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const pageSize = 10;

    const loadLetters = async (isLoadMore: boolean = false) => {
        setLoading(true);
        try {
            const { letters: newLetters, lastVisible: newLastVisible } = await fetchFilteredLetters(pageSize, filters.tags, filters.sort, isLoadMore ? lastVisible : null);

            setLetters(prevLetters => isLoadMore ? [...prevLetters, ...newLetters] : newLetters);
            setLastVisible(newLastVisible);
            setHasMore(newLetters.length === pageSize);  // Якщо менше ніж pageSize, більше немає
        } catch (error) {
            // Приведення типу помилки до Error
            if (error instanceof Error) {
                console.error('Помилка при завантаженні листів:', error.message); // Виводимо повідомлення помилки в консоль
                setError(`Помилка при завантаженні листів: ${error.message}`); // Виводимо повідомлення про помилку на UI
            } else {
                console.error('Невідома помилка:', error);
                setError('Сталася невідома помилка при завантаженні листів');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMoreLetters = () => {
        if (!hasMore || loading) return;
        loadLetters(true);
    };

    useEffect(() => {
        loadLetters();  // Завантажуємо першу сторінку листів
    }, [filters]);  // Повторне завантаження, коли змінюються фільтри або сортування

    return (
        <div>
            <div className={style.gridContainer}>
                {letters.map((letter) => (
                    <DemoLetterCard key={letter.id} letter={letter} onClick={() => onCardClick(letter.id)}/>
                ))}
            </div>

            {error && <p>{error}</p>}

            {hasMore && !loading && (
                <button className={style.nextButton} onClick={loadMoreLetters}>Показати більше</button>
            )}

            {loading && <p>Завантаження...</p>}
        </div>
    );
};

export default LettersComponent;
