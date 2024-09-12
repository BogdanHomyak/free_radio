import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, limit, startAfter, orderBy, where } from 'firebase/firestore';
import { ILetterModel } from '../models/ILetterModel';


// Функція для отримання листів з пагінацією
export const fetchFilteredLetters = async (
    pageSize: number,
    tags: string[],
    sort: string,
    lastVisible: any = null
): Promise<{ letters: ILetterModel[], lastVisible: any }> => {
    const lettersCollection = collection(db, 'letters');

    // Базовий запит
    let q = query(lettersCollection);

    // Фільтр за тегами, якщо теги вибрані
    if (tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', tags)); // Фільтруємо за тегами
    }

    // Додаємо сортування залежно від вибору
    switch (sort) {
        case 'За популярністю':
        case 'Найбільш популярні':
            q = query(q, orderBy('likes', 'desc'));
            break;
        case 'Найменш популярні':
            q = query(q, orderBy('likes', 'asc'));
            break;
        case 'Від старіших до новіших':
            q = query(q, orderBy('createdAt', 'asc'));
            break;
        case 'Від новіших до старіших':
            q = query(q, orderBy('createdAt', 'desc'));
            break;
        default:
            q = query(q, orderBy('senderName')); // Сортування за замовчуванням
    }

    // Додаємо пагінацію
    if (lastVisible) {
        q = query(q, startAfter(lastVisible));
    }

    // Обмежуємо кількість результатів на сторінку
    q = query(q, limit(pageSize));

    const snapshot = await getDocs(q);

    const letters = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data
        } as ILetterModel;
    });

    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { letters, lastVisible: newLastVisible };
};
