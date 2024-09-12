import React, { ReactNode, FC, useEffect, useState } from 'react';
import style from './ModalComponent.module.css';
import LikeButton from "../LikeButtonComponent/LikeButtonComponent";

interface ModalProps {
    letterId: string;
    initialLikes: number;
    onClose: () => void;
    children: ReactNode;
}

const ModalComponent: FC<ModalProps> = ({ children, onClose, initialLikes, letterId }) => {
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
                {/* Блок, що містить кнопку "Закрити" та LikeButton */}
                <div className={`${style.stickyContainer} ${isSticky ? style.sticky : ''}`}>
                    {letterId && initialLikes !== undefined && (
                        <LikeButton
                            singleLetterId={letterId}
                            initialLikes={initialLikes}
                            customClass={style.customLikeButton}
                        />
                    )}
                    <button
                        className={style.closeModal}
                        onClick={onClose}
                    >
                        Закрити
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ModalComponent;
