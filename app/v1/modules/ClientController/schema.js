const { Joi } = require('celebrate');

module.exports = {
    register: {
        body: Joi.object().keys({
            clientName: Joi.string().required(),
            clientEmail: Joi.string().email().required(),
            pincode: Joi.number().required(),
            city: Joi.string().required(),
            address: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            phone: Joi.number().required(),
            password: Joi.string().required(),

        })
    },
    login: {
        body: Joi.object().keys({
            clientEmail: Joi.string().email().required(),
            password: Joi.string().required(),


        })
    },
}