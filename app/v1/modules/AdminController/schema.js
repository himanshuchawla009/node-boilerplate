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
    },
    addWayBill: {
        body: Joi.object().keys({
            service: Joi.string().required(),
            waybill: Joi.string().required()

        })
    },
    addPincode: {
        body: Joi.object().keys({
            covid_zone: Joi.string().valid('Y','N').required(), 
            service: Joi.string().required(), 
            pin: Joi.number().required(), 
            max_amount: Joi.number().required(), 
            pre_paid: Joi.string().valid('Y','N').required(), 
            cash: Joi.string().valid('Y','N').required(), 
            pickup: Joi.string().valid('Y','N').required(), 
            cod: Joi.string().valid('Y','N').required(), 
            country_code: Joi.string().required(), 
            district: Joi.string().required(),
            state_code: Joi.string().required(), 
            max_weight: Joi.number().required()

        })
    },
    updateShipmentStatus: {
        body: Joi.object().keys({
            shipmentId: Joi.string().required(),
            serviceProvider: Joi.string().valid("DTDC", "DELHIVERY"),
            status: Joi.string().valid("PICK_UP_REQUEST_CREATED", "PICK_UP_REQUEST_ACCEPTED", "PICKED_UP_BY_GAINT_LOGISTICS", "PICKED_UP_BY_DELIVERY").required(),


        })
    }
}