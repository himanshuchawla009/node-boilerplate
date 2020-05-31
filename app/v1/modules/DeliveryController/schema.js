const { Joi } = require('celebrate');

module.exports = {
    createOrder: {
        body: Joi.object().keys({
            name: Joi.string().required(),
            order_date: Joi.date().required(),
            pincode: Joi.number().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),

            address:Joi.string().required(),
            paymentMode: Joi.string().valid('COD','Pre-paid').required(),
            waybill: Joi.number().required(),
            phone: Joi.number().required(),
            productDescription: Joi.string().required(),
            cod_amount: Joi.number().required(),
            total_amount: Joi.number().required(),
            quantity: Joi.number().required(),
           
        })
    },
    pickupRequest: {
        body: Joi.object().keys({
            pickupDate: Joi.date().required(),
            pickupTime: Joi.string().required(),
            expectedPackageCount: Joi.number().required()
        })
    }
}