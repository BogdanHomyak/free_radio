import React, {useState} from 'react';
import {db, storage} from '../../firebase/firebaseConfig';
import {ILetterModel} from "../../models/ILetterModel";
import {collection, addDoc, DocumentReference, serverTimestamp} from "firebase/firestore";
import {REGIONS} from "../../constants/regions";
import {TAGS} from "../../constants/tags";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {letterValidationSchema} from '../../validators/sendLetterFormValidator';
import {useNavigate} from "react-router-dom";
import {containsLink, filterText} from "../../services/textFilterService";
import style from './FormComponent.module.css';

const FormComponent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Omit<ILetterModel, 'id' | 'likes' | 'likedBy'>>({
        age: '',
        senderName: '',
        senderRegion: '',
        letterText: '',
        tags: [],
        dataProcessingConsent: false,
        photos: [],
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const {error} = letterValidationSchema.validate(formData, {abortEarly: false});
        if (!error) return null;

        const validationErrors: Record<string, string> = {};
        error.details.forEach((err) => {
            validationErrors[err.path[0]] = err.message;
        });

        return validationErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            tags: checked
                ? [...prevFormData.tags, value]  // Додаємо тег, якщо він вибраний
                : prevFormData.tags.filter((singleTag) => singleTag !== value)  // Видаляємо тег, якщо він знятий
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (files.length > 2) {
                setMessage('Ви можете завантажити не більше 2 фото.');
                return;
            }

            const newPhotoURLs: string[] = [];

            for (let file of files) {
                const storageRef = ref(storage, `letters/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                newPhotoURLs.push(downloadURL);
            }

            setFormData((prevFormData) => ({
                ...prevFormData,
                photos: [...(prevFormData.photos || []), ...newPhotoURLs]
            }));

            setMessage(`Завантажено фото: ${newPhotoURLs.join(', ')}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (containsLink(formData.letterText)) {
            setMessage('Лист містить посилання. Будь ласка, видаліть його.');
            setLoading(false);
            return;
        }

        // Перевірка тексту на наявність нецензурної лексики
        if (filterText(formData.letterText)) {
            setMessage('Лист містить нецензурну лексику. Будь ласка, виправте його.');
            setLoading(false);
            return;
        }

        const validationErrors = validateForm();
        if (validationErrors) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const formDataWithTimestamp = {
                ...formData,
                createdAt: serverTimestamp(),  // Додаємо серверну мітку часу
                likes: 0,  // Початкове значення для лайків
                likedBy: []  // Пустий масив для тих, хто лайкнув
            };

            const docRef: DocumentReference = await addDoc(collection(db, "letters"), formDataWithTimestamp);
            setMessage(`Лист успішно надіслано! ID документа: ${docRef.id}`);
            setFormData({
                age: '',
                senderName: '',
                senderRegion: '',
                letterText: '',
                tags: [],
                dataProcessingConsent: false,
                photos: []
            });
            navigate('/letters');
        } catch (error) {
            setMessage(`Помилка при надсиланні листа: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={style.form} onSubmit={handleSubmit}>
            <div>
                <div className={style.userInfo}>
                    <h2 className={style.h2Letter}>Бахмут, Горбатова, 69 для Вільне радіо</h2>
                    <div>
                        <div>
                            <label>Ім'я відправника:</label>
                            <input
                                type="text"
                                name="senderName"
                                value={formData.senderName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Вік:</label>
                            <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Область відправника:</label>
                            <select
                                name="senderRegion"
                                value={formData.senderRegion}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Оберіть область</option>
                                {REGIONS.map(region => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
                <div>
                    <label>Додати фото (максимум 2):</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploadedFiles.length >= 2}
                    />
                </div>
            </div>
            <div>
                <label>Текст листа:</label>
                <textarea
                    name="letterText"
                    value={formData.letterText}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Оберіть теги:</label>
                {TAGS.map(tagItem => (
                    <div key={tagItem}>
                        <input
                            type="checkbox"
                            value={tagItem}
                            checked={formData.tags.includes(tagItem)}
                            onChange={handleTagChange}
                        />
                        <label>{tagItem}</label>
                    </div>
                ))}
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        name="dataProcessingConsent"
                        checked={formData.dataProcessingConsent}
                        onChange={handleChange}
                        required
                    />
                    Я погоджуюся на обробку моїх даних
                </label>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Надсилання...' : 'Надіслати'}
            </button>

            {message && <p>{message}</p>}

            {Object.keys(errors).map((key) => (
                <div key={key} style={{color: 'red'}}>
                    {errors[key]}
                </div>
            ))}
        </form>
    );
};

export default FormComponent;
