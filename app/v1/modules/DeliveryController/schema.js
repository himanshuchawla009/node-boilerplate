const { Joi } = require('celebrate');

module.exports = {
    checkPincode: {
        query: Joi.object().keys({
            serviceProvider: Joi.string().valid('DELHIVERY','DTDC').required(),
            pincode: Joi.string().required()

        })
    },
    createOrder: {
        body: Joi.object().keys({
            shipments: Joi.array().items(Joi.object().keys({
                name: Joi.string().required(),
                order_date: Joi.date().required(),
                pincode: Joi.number().required(),
                state: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string().required(),

                address: Joi.string().required(),
                paymentMode: Joi.string().valid('COD', 'Pre-paid').required(),
                phone: Joi.number().required(),
                productDescription: Joi.string().required(),
                cod_amount: Joi.number().required(),
                total_amount: Joi.number().required(),
                weight: Joi.number().required(),
                quantity: Joi.number().required(),
            }).required()).required(),
            service: Joi.string().valid('DELHIVERY', 'DTDC')

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