/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    logger = require("../../../../config/logger"),
    deliveryService = require('../../services/partner'),
    dao = require('./dao'),
    uuid = require('uuid'),
    ejs = require("ejs"),
    { orders, pickups } = require('./model');
model = require('./model');
var fs = require('fs');
var pdf = require('html-pdf');



let DELIVERY_SERVICE_NAME = "DELHIVERY";

deliveryController = Object.create(null);

deliveryController.checkPincode = async (req, res, next) => {
    try {

        /**
         * checking if pin code is available for delivery
         */

        let { pincode, serviceProvider } = req.query;

        let service = await deliveryService(serviceProvider);

        let pincodeRes = await service.checkPinCodeAvailable(pincode);

        if (serviceProvider === 'DELHIVERY') {
            if (Object.keys(pincodeRes).length > 0) {

                return res.status(200).json({
                    success: true,
                    message: "Pincode available for delivery",
                    data: pincodeRes
                });
            } else {

                return res.status(200).json({
                    success: false,
                    message: "Pincode not available for delivery",
                    data:[]
                });
            }
        } else {

            if (!!pincodeRes) {

                return res.status(200).json({
                    success: true,
                    message: "Pincode available for delivery",
                    data: pincodeRes
                });
            } else {

                return res.status(200).json({
                    success: false,
                    message: "Pincode not available for delivery",
                });
            }
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
            shipments,
            serviceProvider,
        } = req.body;

        let orderId = uuid.v4().toString();
        let allShipments = [];

        let service = await deliveryService(serviceProvider);

        let currentWayBill = await service.createWayBill()
        if (serviceProvider === 'DTDC') {
            if (currentWayBill.status === false) {
                return res.status(500).json({
                    success: false,
                    message: "DTDC service is temporarily not available, Please contact our team",
                    
                });
            } else {
                currentWayBill = currentWayBill.waybill
            }
        }

        for (let i = 0; i < shipments.length; i++) {
            let currentShipment = shipments[i];
            let ship = {
                "waybill": currentWayBill.toString(),
                "weight": currentShipment.weight,
                "order": orderId,
                "phone": currentShipment.phone,
                "products_desc": currentShipment.productDescription,
                "cod_amount": currentShipment.cod_amount,
                "name": currentShipment.name,
                "country": currentShipment.country,
                "order_date": currentShipment.order_date,
                "total_amount": currentShipment.total_amount,
                "add": currentShipment.address,
                "pin": currentShipment.pincode,
                "quantity": currentShipment.quantity,
                "payment_mode": currentShipment.paymentMode,
                "state": currentShipment.state,
                "city": currentShipment.city,
                "status": "MANIFESTED"
            };

            console.log("shipment", ship)

            allShipments.push(ship)

        }







        if (serviceProvider === 'DTDC') {
            let saveOrderObj = {
                pickUpLocation: "GAINT LOGISTIC",
                clientId: req.user._id,
                shipments: allShipments,
                serviceType: serviceProvider,
                orderId,
                status: "CREATED",
                waybill: currentWayBill.toString()


            }
            let order = await service.createOrder(allShipments, saveOrderObj);
            return res.status(200).json({
                success: true,
                message: "Successfully created order",
                waybill: currentWayBill.toString()
            });

        }
        if (serviceProvider === 'DELHIVERY') {
            let order = await service.createOrder(allShipments);

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
                        message: order.rmk + "An internal Error has occurred, Please get in touch with gaint logistics team"
                    });
                }

            }
            else if (!!order.rmk) {
                return res.status(400).json({
                    success: false,
                    message: order.rmk + "An internal Error has occurred, Please get in touch with gaint logistics team"
                });
            } else {
                try {
                    let saveOrderObj = {
                        pickUpLocation: "GAINT LOGISTIC",
                        clientId: req.user._id,
                        shipments: allShipments,
                        serviceType: serviceProvider,
                        orderId,
                        status: "CREATED",
                        waybill: currentWayBill

                    }
                    await dao.create({ model: orders, obj: saveOrderObj });
                    await dao.insert({
                        model: model.shipments,
                        docArray: allShipments


                    });



                    return res.status(200).json({
                        success: true,
                        data: order
                    });

                } catch (error) {
                    console.log("error", error)
                    let orderstatus = await service.cancelOrder(currentWayBill)

                    //if some error occurs after creating order  then cancel the order
                    if (!!orderstatus.status) {
                        return res.status(200).json({
                            success: true,
                            message: "Some error occured after placing order, so current order is cancelled. Please contact our team"
                        });
                    } else {
                        return res.status(500).json({
                            success: false,
                            message: "Unable to create order, please contact our team"
                        });

                    }
                }

            }
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

        let order = await dao.findOne({ model: orders, params: { waybill }, query: "clientId" })

        console.log("order", order)
        if (order === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid way bill"
            });
        }
        let package = order.shipments[0];
        let data = {}

        if (order.serviceType === "DTDC") {
            data = {
                shippingAddress: package.add,
                cod: package.cod_amount,
                product: package.productDescription,
                orderId: package.orderId,
                sortCode: "",
                wbn: package.waybill,
                orderQrCode: "",
                rpin: package.pin,
                oidBarcode: "",
                price: package.total_amount,
                total: package.total_amount,
                name: package.name,
                destinationAddress: package.add,
                contact: package.phone,
                destinationCity: package.city
            }
        } else if (order.serviceType === "DELHIVERY") {
            let service = await deliveryService(DELIVERY_SERVICE_NAME);

            let slips = await service.createPackingSlip(waybill)
            if (slips.packages.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No packages found for sent waybill number"
                });
            }
          
            let package = slips.packages[0];
            data = {
                shippingAddress: package.destination,
                cod: package.cod,
                product: package.prd,
                orderId: package.oid,
                sortCode: package.sort_code,
                wbn: package.wbn,
                orderQrCode: package.barcode,
                rpin: package.rpin,
                oidBarcode: package.oid_barcode,
                price: package.rs,
                total: package.rs,
                name: package.name,
                destinationAddress: package.destination,
                contact: package.contact,
                destinationCity: package.destination_city
            }
        } else {
            return res.status(500).json({
                success: false,
                message: "Unable to generate pdf of packaging slip, invalid service provider"
            });
        }

     
        ejs.renderFile("templates/packingSlips/delhivery.ejs", {
            shipment: {
                ...data
            }
        }, (err, data) => {
            if (err) {
                console.log("error", err)
                res.send(err);
            } else {
                let options = {
                    "format": "letter"
                };
                pdf.create(data, options).toFile('./businesscard.pdf', function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Unable to generate pdf of packaging slip"
                        });
                    }
                    console.log(result, "pdf file"); // { filename: '/app/businesscard.pdf' }
                    res.download(`./businesscard.pdf`);

                });
            }
        })








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
        let { waybill, serviceProvider } = req.params;
        let service = await deliveryService(serviceProvider);

        let orderstatus = await service.trackOrder(waybill)

        if (serviceProvider == 'DELHIVERY') {
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
        let { waybill, serviceProvider } = req.params;

        let service = await deliveryService(serviceProvider);

        let orderstatus = await service.cancelOrder(waybill)
        // if (!!orderstatus.Error) {
        //     return res.status(400).json({
        //         success: false,
        //         message: orderstatus.Error
        //     });
        // } else {

        // }

        if (serviceProvider === 'DELHIVERY') {
            if (!!orderstatus.status) {
                console.log(orderstatus)
                return res.status(400).json({
                    success: true,
                    message: orderstatus.error
                });
            }

            else if (orderstatus.status == true) {
                console.log(orderstatus)
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
                success: true,
                message: "Successfully cancelled order"
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
        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1,
            limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;


        console.log(req.user._id, "client id");
        const totalCount = await dao.count({
            model: orders, params: {
                clientId: req.user._id
            }
        });


        let allOrders = await dao.find({
            model: orders, params: {
                clientId: req.user._id
            },
            skip: (page - 1) * limit,
            limit: limit
        });

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


deliveryController.getPickups = async (req, res, next) => {
    try {

        /**
         * get pickups 
         * 
         */
        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1,
            limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;

        const totalCount = await dao.count({
            model: pickups, params: {
                clientId: req.user._id
            }
        });

        let allPickups = await dao.find({
            model: pickups, params: {
                clientId: req.user._id
            },
            skip: (page - 1) * limit,
            limit: limit
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

deliveryController.getOrderById = async (req, res, next) => {
    try {

        /**
         * get order details by waybill 
         * 
         */
        console.log(req.user._id, "client id");
        let order = await dao.findOne({
            model: orders, params: {
                waybill: req.query.orderId
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