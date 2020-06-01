const controller = require("./controller"),
	{ celebrate } = require('celebrate'),
	{ authenticateClient } = require('../../middlewares/auth/clientAuth');
validateSchema = require("./schema");





module.exports = function (router) {



	router.post('/rate/calculate',
		authenticateClient,
		controller.calculateRate
	);
}