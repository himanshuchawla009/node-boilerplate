const controller = require("./controller"),
    { celebrate } = require('celebrate'),
    validateSchema = require("./schema");




module.exports = function (router) {



    router.post('/client/register',
        celebrate(validateSchema.register),
        controller.register
    );

    router.post('/client/login',
        celebrate(validateSchema.login),
        controller.login
    );

	
}