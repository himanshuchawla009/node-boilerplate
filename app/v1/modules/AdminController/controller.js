/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    uuid = require('uuid'),
    dao = require('./dao'),
    { clients } = require('./model'),
    { pickups }  = require('../DeliveryController/model'),
    logger = require("../../../../config/logger");



adminController = Object.create(null);

adminController.createClient = async (req, res, next) => {
    try {

        /**
         * saving new client along with api key in db
         * 
         */
        let { clientName, pincode, city, address, state, country, phone } = req.body;
        console.log(clientName, "name")

        let clientDetails = await dao.findOne({ model: clients, params: { name: clientName } });
        console.log(clientDetails, "details")
        if (!!clientDetails) {
            return res.status(400).json({
                success: false,
                message: "Client with this name already exists"
            });

        }

        let key = uuid.v4();

        let client = {
            name: clientName,
            apiKey: key,
            pincode,
            city,
            address,
            state,
            country,
            phone
        }
        console.log("client", client)

        await dao.create({ model: clients, obj: client });


        return res.status(200).json({
            success: true,
            message: "Client created successfully",
            apiKey: key
        });



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

adminController.fetchClientApiKey = async (req, res, next) => {
    try {

        /**
         * fetch client api key using client name
         * 
         */

        let { name } = req.params;

        let clientDetails = await dao.findOne({ model: clients, params: { name } });

        if (!!clientDetails) {
            return res.status(200).json({
                success: true,
                apiKey: clientDetails.apiKey
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid client name"
            });
        }


    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


adminController.updatePickupRequest = async (req, res, next) => {
    try {

        /**
         * fetch client api key using client name
         * 
         */

        let { pickupId, status } = req.body;

        let pickupDetails = await dao.findOneAndUpdate({ model: pickups, query: { _id: pickupId }, params: { status } });

        return res.status(200).json({
            success: true,
            message: "Pickup request status successfully updated"
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

module.exports = adminController;