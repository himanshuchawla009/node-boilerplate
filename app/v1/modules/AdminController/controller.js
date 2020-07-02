/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    uuid = require('uuid'),
    dao = require('./dao'),
    { clients } = require('./model'),
    { pickups, wayBills, pincodes } = require('../DeliveryController/model'),
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


adminController.updateShipmentStatus = async (req, res, next) => {
    try {

        /**
         * update shipment status
         * 
         * 
         */

        let { shipmentId, status, serviceProvider } = req.body;

        if (serviceProvider === 'DTDC') {
            await dao.findOneAndUpdate({ model: shipments, query: { _id: shipmentId }, params: { status } });

        } else {
            return res.status(400).json({
                success: true,
                message: "You can only update shipment status delivered by dtdc"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Shipement status successfully updated"
        });

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
adminController.addWayBill = async (req, res, next) => {
    try {

        /**
         * add a new pre generated way bill to database
         * 
         */

        let { service, waybill } = req.body;

        await dao.create({
            model: wayBills, obj: {
                service,
                waybill
            }
        });

        return res.status(200).json({
            success: true,
            message: "Way bill added successfully"
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

adminController.fetchWayBills = async (req, res, next) => {
    try {

        /**
         * add a new pre generated way bill to database
         * 
         */

        let { service, allotedUserId, allotedOrderId } = req.query;

        let params = {};

        if (!!service) {
            params['service'] = service
        }

        if (!!allotedUserId) {
            params['allotedUserId'] = allotedUserId
        }

        if (!!allotedOrderId) {
            params['allotedOrderId'] = allotedOrderId
        }

        let wayBills = await dao.find({ model: wayBills, params });

        return res.status(200).json({
            success: true,
            data: waybills
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


adminController.addPincode = async (req, res, next) => {
    try {

        /**
         * add a new pincode to database
         * 
         */

        let { covid_zone, service, pin, max_amount, pre_paid, cash, pickup, cod, country_code, district,
            state_code, max_weight
        } = req.body;

        await dao.create({
            model: pincodes, obj: {
                covid_zone, service, pin, max_amount, pre_paid, cash, pickup, cod, country_code, district,
                state_code, max_weight
            }
        });

        return res.status(200).json({
            success: true,
            message: "Pincode added successfully"
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

adminController.fetchPincodes = async (req, res, next) => {
    try {

        /**
         * fetch servicable pincodes of any service provider
         * 
         */

        let { service, pin } = req.query;

        let params = {};

        if (!!service) {
            params['service'] = service
        }

        if (!!pin) {
            params['pin'] = pin
        }


        let wayBills = await dao.find({ model: pincodes, params });

        return res.status(200).json({
            success: true,
            data: waybills
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


adminController.getAllUsers = async (req, res, next) => {
    try {

        /**
         * fetch servicable pincodes of any service provider
         * 
         */

        let { page, limit } = req.query;



        let users = await dao.find({ model: clients });

        return res.status(200).json({
            success: true,
            data: users
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};



module.exports = adminController;