/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    uuid = require('uuid'),
    bcrypt = require('bcryptjs')
dao = require('./dao'),
    { clients } = require('./model'),
    { pickups, wayBills, pincodes, orders, shipments } = require('../DeliveryController/model'),
    logger = require("../../../../config/logger");

    const notification = require('../../services/notification')




adminController = Object.create(null);

adminController.createClient = async (req, res, next) => {
    try {

        /**
         * saving new client along with api key in db
         * 
         */
        let { clientEmail, clientName, pincode, city, address, state, country, phone } = req.body;

        let clientDetails = await dao.findOne({ model: clients, params: { clientEmail: clientEmail } });
        if (!!clientDetails) {
            return res.status(400).json({
                success: false,
                message: "Client with this email already exists"
            });

        }
        let password = uuid.v4();

        let key = uuid.v4();
        const hash = await bcrypt.hash(password, 10);

        let client = {
            clientEmail,
            name: clientName,
            apiKey: key,
            pincode,
            city,
            address,
            state,
            country,
            phone,
            approved: true,
            blocked: false,
            password: hash
        }
        console.log("client", client)

        await dao.create({ model: clients, obj: client });

        let name = clientName
        let countryCode =  "91"
        let message = `Your shipo account credentials are: 
         Emal: ${clientEmail}, Password: ${password} , Api Key: ${key}`;
        await notification.send_sms(countryCode,phone,name, message)
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

        await dao.findOneAndUpdate({ model: orders, query: { _id: shipmentId }, params: { status } });




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

adminController.getPickups = async (req, res, next) => {
    try {

        /**
         * get pickups 
         * 
         */
        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1,
        limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;

        let allPickups = await dao.find({
            model: pickups, params: {}, query:"clientId", skip: (page - 1) * limit,
            limit: limit
        });
        const totalCount = await dao.count({
            model: pickups, params: {
            }
        });
        return res.status(200).json({
            success: true,
            data: allPickups,
            totalCount
        })



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
                wayBill: waybill
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

        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1,
        limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;
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

        let wayBillsData = await dao.find({ model: wayBills, params,
            skip: (page - 1) * limit,
            limit: limit });

        const totalCount = await dao.count({
            model: wayBills, params })
            
        return res.status(200).json({
            success: true,
            data: wayBillsData,
            totalCount
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

        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1,
        limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;


        let users = await dao.find({ model: clients, params:{}, skip: (page - 1) * limit,
        limit: limit  });

        const totalCount = await dao.count({
            model: clients, params:{}
            
         })
            
        return res.status(200).json({
            success: true,
            data: users,
            totalCount
        });

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


adminController.getOrders = async (req, res, next) => {
    try {

        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1,
        limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;


        let allOrders = await dao.find({
            model: orders, params: {}, skip: (page - 1) * limit,
            limit: limit 
        });

        const totalCount = await dao.count({
            model: orders, params:{}
            
        })

        return res.status(200).json({
            success: true,
            data: allOrders,
            totalCount
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


adminController.getShipmentSummary = async (req, res, next) => {
    try {

        /**
         * get pickups 
         * 
         */
        let serviceProviders = await orders.aggregate([
            { $group: { _id: { serviceType: '$serviceType' }, total: { $sum: 1 } } },
            { $project: { serviceType: '$_id.serviceType', total: '$total', _id: 0 } }
        ])

        let pickupsSummary = await pickups.aggregate([
            { $group: { _id: { status: '$status' }, total: { $sum: 1 } } },
            { $project: { status: '$_id.status', total: '$total', _id: 0 } }
        ])


        let dtdcShipmentsSummary = await orders.aggregate([
            { $group: { _id: { status: '$status' }, total: { $sum: 1 } } },
            { $project: { status: '$_id.status', total: '$total', _id: 0 } }
        ])

        return res.status(200).json({
            success: true,
            data: {
                serviceProviders,
                pickupsSummary,
                dtdcShipmentsSummary
            }
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

module.exports = adminController;