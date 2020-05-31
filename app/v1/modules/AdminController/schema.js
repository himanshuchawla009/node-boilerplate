const { Joi } = require('celebrate');

module.exports = {
    generateClient: {
        body: Joi.object().keys({
            clientName: Joi.string().required(),
            pincode: Joi.number().required(),
            city: Joi.string().required(),
            address: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            phone: Joi.number().required(),

        })
    },
    adminLogin: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),


        })
    },
    updatePickupRequest: {
        body: Joi.object().keys({
            pickupId: Joi.string().required(),
            status: Joi.string().valid("PICK_UP_REQUEST_CREATED", "PICK_UP_REQUEST_ACCEPTED", "PICKED_UP_BY_GAINT_LOGISTICS", "PICKED_UP_BY_DELIVERY").required(),


        })
    }
}