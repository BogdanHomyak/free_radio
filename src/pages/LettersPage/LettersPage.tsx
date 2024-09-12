import React, { useState } from 'react';
import style from './LettersPage.module.css';
import TagFilterComponent from "../../components/TagFilterComponent/TagFilterComponent";
import LettersComponent from "../../components/LettersComoonent/LettersComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LetterComponent from "../../components/LetterComponent/LetterComponent";

const LettersPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

    const openModal = (letterId: string) => {
        console.log(`Opening modal for letter ID: ${letterId}`);
        setSelectedLetterId(letterId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLetterId(null);
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

            {isModalOpen && selectedLetterId && (
                console.log("Modal is open with letter ID:", selectedLetterId),
                    <ModalComponent onClose={closeModal}>
                        <LetterComponent letterId={selectedLetterId} />
                    </ModalComponent>
            )}
            <div className={style.imgBg}></div>
        </div>
    );
};

export default LettersPage;