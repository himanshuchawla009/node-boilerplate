/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    logger = require("../../../../config/logger"),
    deliveryService = require('../../services/partner'),
    dao = require('./dao'),
    { orders, pickups } = require('./model');


let DELIVERY_SERVICE_NAME = "DELHIVERY";

deliveryController = Object.create(null);

deliveryController.checkPincode = async (req, res, next) => {
    try {

        /**
         * checking if pin code is available for delivery
         */

        let { pincode } = req.query;

        let service = await deliveryService(DELIVERY_SERVICE_NAME);

        let pincodeRes = await service.checkPinCodeAvailable(pincode);

        if (pincodeRes.delivery_codes.length > 0) {

            return res.status(200).json({
                success: true,
                message: "Pincode available for delivery",
                data: pincodeRes
            });
        } else {

            return res.status(200).json({
                success: false,
                message: "Pincode not available for delivery",
                data: pincodeRes
            });
        }


    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};



deliveryController.generateWayBill = async (req, res, next) => {
    try {

        /**
         * generating waybill number
         * 
         */


        let service = await deliveryService(DELIVERY_SERVICE_NAME);

        let waybillRes = await service.createWayBill()
        return res.status(200).json({
            success: true,
            data: waybillRes
        });



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


deliveryController.generateOrder = async (req, res, next) => {
    try {

        /**
         * generate order
         * 
         */

        let {
            name,
            order_date,
            pincode,
            state,
            city,
            paymentMode,
            address,
            waybill,
            phone,
            productDescription,
            cod_amount,
            total_amount,
            quantity,
            country,
            weight

        } = req.body;

        let orderId = waybill;
        let orderDetails = {
            "waybill": waybill,
            "weight":weight,
            "order": orderId,
            "phone": phone,
            "products_desc": productDescription,
            "cod_amount": cod_amount,
            "name": name,
            "country": country,
            "order_date": order_date,
            "total_amount": total_amount,
            "add": address,
            "pin": pincode,
            "quantity": quantity,
            "payment_mode": paymentMode,
            "state": state,
            "city": city
        }
        let service = await deliveryService(DELIVERY_SERVICE_NAME);
        

        let order = await service.createOrder(orderDetails);



        order = JSON.parse(order);
        if (order.success == false) {
            if (order.packages.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: order.packages[0].remarks
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "An internal Error has occurred, Please get in touch with gaint logistics team"
                });
            }

        }
        else if (!!order.rmk) {
            return res.status(400).json({
                success: false,
                message: "An internal Error has occurred, Please get in touch with gaint logistics team"
            });
        } else {
            let saveOrderObj = {
                ...orderDetails,
                clientId: req.user._id,

            }
            await dao.create({ model: orders, obj: saveOrderObj });
            return res.status(200).json({
                success: true,
                data: order
            });

        }

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


deliveryController.generatePackingSlip = async (req, res, next) => {
    try {


        /**
       * get packing slip data using waybill number
       * 
       */
        let { waybill } = req.params;
        let service = await deliveryService(DELIVERY_SERVICE_NAME);

        let slips = await service.createPackingSlip(waybill)
        if (slips.packages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No packages found for sent waybill number"
            });
        } else {
            return res.status(200).json({
                success: true,
                data: slips
            });
        }




    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

deliveryController.generatePickupRequest = async (req, res, next) => {
    try {

        /**
         * generating pick up request
         * 
         */
        let { pickupTime, pickupDate, expectedPackageCount } = req.body;


        let clientDetails = await dao.create({
            model: pickups,
            obj: {
                pickupTime,
                pickupDate,
                expectedPackageCount,
                clientId: req.user._id,
                status: "PICK_UP_REQUEST_CREATED"
            }
        });

        console.log(clientDetails);
        return res.status(200).json({
            success: "true",
            message: "Pick up request created successfully"
        });


    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


deliveryController.trackOrder = async (req, res, next) => {
    try {

        /**
         * track order using waybill number
         * 
         */
        let { waybill } = req.params;
        let service = await deliveryService(DELIVERY_SERVICE_NAME);

        let orderstatus = await service.trackOrder(waybill)
        if (!!orderstatus.Error) {
            return res.status(400).json({
                success: false,
                message: orderstatus.Error
            });
        } else {
            return res.status(200).json({
                success: true,
                data: orderstatus
            });
        }




    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


deliveryController.cancelOrder = async (req, res, next) => {
    try {

        /**
         * track order using waybill number
         * 
         */
        let { waybill } = req.params;
        console.log(req.user._id, "client id");
        let orderDetails = await dao.findOne({
            model: orders, params: {
                clientId: req.user._id,
                waybill
            }
        });

        if (!!orderDetails) {
            let service = await deliveryService(DELIVERY_SERVICE_NAME);

            let orderstatus = await service.cancelOrder(waybill)
            // if (!!orderstatus.Error) {
            //     return res.status(400).json({
            //         success: false,
            //         message: orderstatus.Error
            //     });
            // } else {

            // }

            if (!!orderstatus.status) {
                return res.status(200).json({
                    success: true,
                    message: orderstatus.remark
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Unable to cancel order, please contact gaint logistics team"
                });

            }


        } else {
            return res.status(200).json({
                success: false,
                message: "Invalid order id"
            });

        }






    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};




deliveryController.getOrders = async (req, res, next) => {
    try {

        /**
         * track order using waybill number
         * 
         */
        console.log(req.user._id, "client id");
        let allOrders = await dao.find({
            model: orders, params: {
                clientId: req.user._id
            }
        });

        return res.status(200).json({
            success: true,
            data: allOrders
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


deliveryController.getPickups = async (req, res, next) => {
    try {

        /**
         * get pickups 
         * 
         */
        let allPickups = await dao.find({
            model: pickups, params: {
                clientId: req.user._id
            }
        });

        return res.status(200).json({
            success: true,
            data: allPickups
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

deliveryController.getOrderByWayBill = async (req, res, next) => {
    try {

        /**
         * get order details by waybill 
         * 
         */
        console.log(req.user._id, "client id");
        let order = await dao.findOne({
            model: orders, params: {
                waybill: req.query.waybill
            }
        });

        return res.status(200).json({
            success: true,
            data: order
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

deliveryController.getPickupById = async (req, res, next) => {
    try {

        /**
         * get pickups 
         * 
         */
        console.log(req.user._id, "client id");
        let pickup = await dao.findOne({
            model: pickups, params: {
                _id: req.query.pickUpId
            }
        });

        return res.status(200).json({
            success: true,
            data: pickup
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


module.exports = deliveryController;