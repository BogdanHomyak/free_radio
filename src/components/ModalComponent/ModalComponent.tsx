import React, { ReactNode, FC, useEffect, useState } from 'react';
import style from './ModalComponent.module.css';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const ModalComponent: FC<ModalProps> = ({ children, onClose }) => {
    const [isSticky, setIsSticky] = useState(false);

    const handleScroll = () => {
        const scrollTop = document.querySelector(`.${style.modalContent}`)?.scrollTop;
        if (scrollTop && scrollTop > 50) {  // Якщо прокручено більше 50px
            setIsSticky(true);
        } else {
            setIsSticky(false);
        }
    };

    useEffect(() => {
        const modalContent = document.querySelector(`.${style.modalContent}`);
        modalContent?.addEventListener('scroll', handleScroll);
        return () => {
            modalContent?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={style.modalOverlay} onClick={onClose}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                <button
                    className={`${style.closeModal} ${isSticky ? style.stickyButton : ''}`}
                    onClick={onClose}
                >
                    Закрити
                </button>
                {children}
            </div>
        </div>
    );
};

export default ModalComponent;
