const controller = require("./controller"),
    { celebrate } = require('celebrate'),
    validateSchema = require("./schema"),
    { authenticateClient } = require('../../middlewares/auth/clientAuth');
    uuid = require('uuid'),
    path = require('path');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
  var upload = multer({ storage: storage });


module.exports = function (router) {



    router.post('/client/register',
        celebrate(validateSchema.register),
        controller.register
    );

    router.post('/client/login',
        celebrate(validateSchema.login),
        controller.login
    );

    router.post('/client/uploadShipmentsExcel',
        upload.single('excel'),
        controller.uploadShipmentsExcel
    );

    router.get('/client/getShipmentsSummary',
		authenticateClient,
		controller.getShipmentSummary
	);


}