import Joi from 'joi';

export const letterValidationSchema = Joi.object({
    senderName: Joi.string().max(20).required().label("Ім'я відправника"),
    senderRegion: Joi.string().required().label("Область відправника"),
    letterText: Joi.string().max(5000).required().label("Текст листа"),
    tags: Joi.array().items(Joi.string()).required(),
    dataProcessingConsent: Joi.boolean().valid(true).required().label("Згода на обробку даних"),
    photos: Joi.array().items(Joi.string()).max(2).label("Фотографії"),
    age: Joi.string().label("Вік")
});