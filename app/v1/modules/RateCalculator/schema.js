const { Joi } = require('celebrate');

module.exports = {
    calculateRate: {
        body: Joi.object().keys({
            weight: Joi.date().required(),
            desctinationPincode: Joi.string().required()
        })
    }
}