import React, { useState } from 'react';
import style from './LettersPage.module.css';
import TagFilterComponent from "../../components/TagFilterComponent/TagFilterComponent";
import LettersComponent from "../../components/LettersComoonent/LettersComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LetterComponent from "../../components/LetterComponent/LetterComponent";
import { doc, getDoc, collection, getDocs, query, limit, startAfter, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const LettersPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
    const [initialLikes, setInitialLikes] = useState<number | null>(null); // Стан для початкової кількості лайків
    const [loadingLikes, setLoadingLikes] = useState<boolean>(false); // Стан для індикації завантаження
    const openModal = async (letterId: string) => {
        setSelectedLetterId(letterId);
        setLoadingLikes(true); // Починаємо завантаження кількості лайків

        // Завантажуємо кількість лайків з Firebase
        try {
            const docRef = doc(db, 'letters', letterId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const likes = docSnap.data().likes || 0; // Отримуємо кількість лайків з Firebase
                setInitialLikes(likes); // Встановлюємо початкову кількість лайків
            } else {
                console.error('Лист не знайдено');
            }
        } catch (error) {
            console.error('Помилка при завантаженні кількості лайків:', error);
        } finally {
            setLoadingLikes(false); // Завантаження завершене
        }

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLetterId(null);
        setInitialLikes(null); // Очищуємо кількість лайків після закриття
    };

    const [filters, setFilters] = useState<{ tags: string[], sort: string }>({
        tags: [],
        sort: 'За популярністю',
    });

    const handleFilterChange = (selectedTags: string[], selectedSort: string) => {
        setFilters({
            tags: selectedTags,
            sort: selectedSort,
        });
    };

    return (
        <div className={style.lettersPage}>
            <TagFilterComponent onFilterChange={handleFilterChange} />
            <LettersComponent filters={filters} onCardClick={openModal} />

            {isModalOpen && selectedLetterId && initialLikes !== null && (
                <ModalComponent
                    onClose={closeModal}
                    letterId={selectedLetterId} // Передаємо ID листа
                    initialLikes={initialLikes} // Передаємо динамічно отриману кількість лайків
                >
                    <LetterComponent letterId={selectedLetterId}/>
                </ModalComponent>
            )}

            {loadingLikes && <p>Завантаження кількості лайків...</p>} {/* Індикація завантаження */}
            <div className={style.imgBg}></div>
        </div>
    );
};

export default LettersPage;