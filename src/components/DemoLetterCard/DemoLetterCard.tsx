import React, {FC} from 'react';
import LikeButton from '../LikeButtonComponent/LikeButtonComponent';
import {ILetterModel} from "../../models/ILetterModel";
import style from './DemoLetterCard.module.css';

interface DemoLetterCardProps {
    letter: ILetterModel;
    onClick: () => void;
}

const DemoLetterCard: FC<DemoLetterCardProps> = ({letter, onClick}) => {
    const handleLikeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Зупиняємо поширення події, щоб модальне вікно не відкривалося
    };
    return (
        <div className={style.card} onClick={() => {
            console.log(`Card clicked with letter ID: ${letter.id}`);
            onClick();
        }}>

            <div>
                <p className={style.text}>{letter.letterText.substring(0, 60)}...</p>
            </div>
            <div className={style.infoContainer}>
                <div className={style.blockWrapper}>
                    <div className={style.paragraphWrapper}>
                        <p>Відправник:</p>
                        <h3 className={style.nameBlock}>
                            {letter.senderName}
                            {letter.age && `, ${letter.age} років`}
                        </h3>
                    </div>
                    <div>
                        <h3 className={style.nameBlock}> {letter.senderRegion}</h3>
                    </div>
                </div>
                {letter.photos && letter.photos[0] && (
                    <img src={letter.photos[0]} alt="Letter Photo" className={style.photo}/>
                )}
            </div>

            <div className={style.likeButton} onClick={handleLikeClick}>
                <LikeButton singleLetterId={letter.id} initialLikes={letter.likes}/>
            </div>
        </div>
    );
};

export default DemoLetterCard;
