import React, { useState, useEffect, FC } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import style from './LikeButtonComponent.module.css';

interface LikeButtonProps {
    singleLetterId: string;
    initialLikes: number;
    customClass?: string;  // Додатковий пропс для кастомного класу
}

const LikeButton: FC<LikeButtonProps> = ({ singleLetterId, initialLikes, customClass }) => {
    const [likes, setLikes] = useState<number>(initialLikes);
    const [ipAddress, setIpAddress] = useState<string>('');
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        // Fetch IP Address
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIpAddress(data.ip));
    }, []);

    useEffect(() => {
        const checkIfLiked = async () => {
            if (!singleLetterId || !ipAddress) {
                return;
            }

            try {
                const docRef = doc(db, 'letters', singleLetterId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const likedBy = docSnap.data().likedBy || [];
                    if (likedBy.includes(ipAddress)) {
                        setLiked(true);  // User already liked
                    }
                }
            } catch (error) {
                console.error("Error checking if liked:", error);
            }
        };

        if (ipAddress) {
            checkIfLiked();
        }
    }, [ipAddress, singleLetterId]);

    const handleLike = async () => {
        if (!singleLetterId) return; // Ensure we have a valid letter ID

        try {
            const docRef = doc(db, 'letters', singleLetterId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const currentLikes = docSnap.data().likes || 0;
                const likedBy = docSnap.data().likedBy || [];

                if (likedBy.includes(ipAddress)) {
                    // If IP address is already in likedBy, remove the like and IP
                    await updateDoc(docRef, {
                        likes: currentLikes > 0 ? currentLikes - 1 : 0,  // Decrease like count
                        likedBy: likedBy.filter((ip: string) => ip !== ipAddress),  // Remove IP from likedBy
                    });

                    setLikes(currentLikes - 1);
                    setLiked(false);
                } else {
                    // If IP address is not in likedBy, add the like and IP
                    await updateDoc(docRef, {
                        likes: currentLikes + 1,
                        likedBy: [...likedBy, ipAddress],  // Add IP to likedBy
                    });

                    setLikes(currentLikes + 1);
                    setLiked(true);
                }
            }
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    return (
        <div className={`${style.likeContainer} ${customClass ? customClass : ''}`}>
            <div>
                <span>{likes}</span> <span className={style.likeText}>вподобань</span>
            </div>
            <button onClick={handleLike} className={style.likeButton}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="21"
                    viewBox="0 0 25 21"
                    fill={liked ? "#E5392C" : "black"}
                >
                    <path d="M5.84191 0.26022C5.24656 0.325039 4.44531 0.544428 3.90205 0.791241C3.14793 1.13279 2.56002 1.54415 1.9473 2.16242C0.674734 3.44386 0 5.09177 0 6.9142C0 7.98372 0.210854 8.91862 0.669773 9.8984C1.80591 12.3217 4.82237 15.4654 9.09155 18.6839C10.5849 19.8083 12.3412 21 12.5099 21C12.6835 21 14.8367 19.5191 16.3102 18.3873C20.4033 15.241 23.1791 12.3092 24.3202 9.92582C24.6898 9.15546 24.8709 8.52472 24.9701 7.67209C25.0197 7.24329 25.0049 6.28844 24.9453 5.9095C24.8287 5.18651 24.6303 4.55826 24.3252 3.93499C23.3602 1.96547 21.5518 0.624207 19.4234 0.295122C19.0538 0.237782 18.3344 0.220329 17.9474 0.255232C16.4888 0.392351 15.1443 0.970741 13.8296 2.02281C13.6659 2.15495 13.2987 2.494 13.0134 2.77821L12.4975 3.29428L12.3412 3.12973C12.2568 3.03749 12.1576 2.9278 12.1229 2.88791C12.0212 2.76325 11.3936 2.19483 11.1058 1.96797C9.94489 1.04304 8.7269 0.492073 7.41216 0.292629C7.10208 0.24526 6.15447 0.225315 5.84191 0.26022Z" />
                </svg>
            </button>
        </div>
    );
};

export default LikeButton;