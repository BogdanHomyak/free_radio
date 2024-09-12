import React, { FC, useEffect, useState } from 'react';
import LikeButton from '../LikeButtonComponent/LikeButtonComponent';
import { ILetterModel } from "../../models/ILetterModel";
import style from "./LetterComponent.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface LetterComponentProps {
    letterId: string; // Отримуємо letterId через пропси
}

const LetterComponent: FC<LetterComponentProps> = ({ letterId }) => {
    const [letter, setLetter] = useState<ILetterModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                const docRef = doc(db, 'letters', letterId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLetter({ id: docSnap.id, ...docSnap.data() } as ILetterModel);
                } else {
                    setError('Лист не знайдено');
                }
            } catch (err) {
                setError('Помилка при завантаженні листа');
            } finally {
                setLoading(false);
            }
        };

        fetchLetter();
    }, [letterId]);

    if (loading) {
        return <p>Завантаження...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!letter) {
        return <p>Лист не знайдено.</p>;
    }

    return (
        <div className={style.letterContainer}>
            <div className={style.headerLetter}>
                <LikeButton
                    initialLikes={letter.likes}
                    singleLetterId={letter.id}
                    customClass={style.customLikeButton}
                />
            </div>
            <div className={style.contentWrapper}>
                <div>
                    <h2>{letter.senderName} {letter.age && `, ${letter.age} років`}</h2>
                    <h2>{letter.senderRegion}</h2>
                </div>
                <div className={style.imgWrapper}>
                    {letter.photos && letter.photos.map((photo, index) => (
                        <img key={index} src={photo} alt="Letter Photo" style={{ width: '100%', height: '100%' }} />
                    ))}
                </div>
                <div className={style.tagsWrapper}>
                    <h4>Теги:</h4>
                    <div className={style.tagsBlock}>
                        {letter.tags && letter.tags.map((tag, index) => (
                            <div key={index} className={style.tags}>{tag}</div>
                        ))}
                    </div>
                </div>
                <div className={style.paragraphWrapper}>
                    <p className={style.underlineParagraph}>{letter.letterText}</p>
                </div>
            </div>
        </div>
    );
};

export default LetterComponent;