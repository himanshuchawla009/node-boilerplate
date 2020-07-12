/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    uuid = require('uuid'),
    bcrypt = require('bcryptjs'),
    dao = require('./../AdminController/dao'),
    { clients } = require('./../AdminController/model'),
    deliveryModel = require('./../DeliveryController/model'),
    logger = require("../../../../config/logger"),
    deliveryService = require('../../services/partner');
const presets = require("../../../../utils/presets");
const jwt = require('jsonwebtoken');
const xlsxFile = require('read-excel-file/node');


clientController = Object.create(null);

clientController.register = async (req, res, next) => {
    try {

        /**
         * saving new client along with api key in db
         * 
         */
        let { clientName, clientEmail, pincode, city, address, state, country, phone, password } = req.body;

        let clientDetails = await dao.findOne({ model: clients, params: { clientEmail: clientEmail } });
        if (!!clientDetails) {
            return res.status(400).json({
                success: false,
                message: "Client with this email already exists"
            });

        }

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
            approved: false,
            blocked: false,
            password: hash
        }
        console.log("client", client)

        await dao.create({ model: clients, obj: client });


        return res.status(200).json({
            success: true,
            message: "You have been registered successfully",
            apiKey: key
        });



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};


clientController.login = async (req, res, next) => {
    try {


        let { clientEmail, password } = req.body;

        let clientDetails = await dao.findOne({ model: clients, params: { clientEmail: clientEmail } });


        if (!!clientDetails) {
            const isPasswordMatch = await bcrypt.compare(
                password,
                clientDetails.password
            );
            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }
            const token = await jwt.sign(
                {
                    email: clientEmail,
                    userId: clientDetails._id,
                    userType: 'client'
                },
                presets.JWT_KEY,
                {
                    expiresIn: presets.expiresIn
                }
            );
            return res.status(200).json({
                success: true,
                token: token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

clientController.uploadShipmentsExcel = async (req, res, next) => {
    try {
        console.log("file", req.file)
        let successOrders = []
        let failedOrders = []
        if (!!req.file) {
            let rows = await xlsxFile(req.file.path);
            console.log(rows);
            let delhiveryShipments = [];

            //dtdc shipments
            for (let r = 1; r < rows.length; r++) {
                let orderId = uuid.v4().toString();
                let allShipments = [];
                console.log("current row", rows[r])
                let currentShipment = rows[r]
                let serviceProvider = currentShipment[15]
                console.log("service provider", serviceProvider)
                if (serviceProvider === 'DELHIVERY') {
                    delhiveryShipments.push(r);
                } else {
                    let service = await deliveryService(serviceProvider);

                    let currentWayBill = await service.createWayBill()

                    if(currentWayBill.status === false) {
                        failedOrders.push(currentShipment[0])
                        continue;
                    } 

                    let ship = {
                        "name": currentShipment[1],
                        "waybill": currentWayBill.waybill,
                        "weight": currentShipment[13],
                        "order": orderId,
                        "phone": currentShipment[9],
                        "products_desc": currentShipment[10],
                        "cod_amount": currentShipment[11],
                        "country": currentShipment[7],
                        "order_date": currentShipment[2],
                        "total_amount": currentShipment[12],
                        "add": currentShipment[7],
                        "pin": currentShipment[5],
                        "quantity": currentShipment[14],
                        "payment_mode": currentShipment[8],
                        "state": currentShipment[3],
                        "city": currentShipment[4],
                        "status": "MANIFESTED"
                    };
                    allShipments.push(ship)

                    console.log("all shipments", allShipments)
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

                    successOrders.push(currentShipment[0])
                }
            }

            for (let i = 0; i < delhiveryShipments.length; i++) {

                let r = delhiveryShipments[i];

                let orderId = uuid.v4().toString();
                let allShipments = [];
                console.log("current row", rows[r])
                let currentShipment = rows[r]
                let serviceProvider = currentShipment[15]

                let service = await deliveryService(serviceProvider);

                let currentWayBill = await service.createWayBill()

                let ship = {
                    "name": currentShipment[1],
                    "waybill": currentWayBill,
                    "weight": currentShipment[13],
                    "order": orderId,
                    "phone": currentShipment[9],
                    "products_desc": currentShipment[10],
                    "cod_amount": currentShipment[11],
                    "country": currentShipment[7],
                    "order_date": currentShipment[2],
                    "total_amount": currentShipment[12],
                    "add": currentShipment[7],
                    "pin": currentShipment[5],
                    "quantity": currentShipment[14],
                    "payment_mode": currentShipment[8],
                    "state": currentShipment[3],
                    "city": currentShipment[4],
                    "status": "MANIFESTED"
                };
                console.log(ship,"shipment")
                allShipments.push(ship)
                let order = await service.createOrder(allShipments);

                order = JSON.parse(order);
                if (order.success == false) {

                    if (order.packages.length > 0) {
                        failedOrders.push(currentShipment[0])
                    } else {
                        failedOrders.push(currentShipment[0])
                    }

                }
                else if (!!order.rmk) {
                    failedOrders.push(currentShipment[0])
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
                            model: deliveryModel.shipments,
                            docArray: allShipments


                        });


                        successOrders.push(currentShipment[0])

                    } catch (error) {
                        console.log("error", error)
                        let orderstatus = await service.cancelOrder(currentWayBill)

                        //if some error occurs after creating order  then cancel the order
                        if (!!orderstatus.status) {
                            failedOrders.push(currentShipment[0])
                            return res.status(500).json({
                                success: true,
                                message: "Some order are not able to get placed, Please contact our team",
                                failedOrders,
                                successOrders
                            });
                        } else {
                            failedOrders.push(currentShipment[0])
                            return res.status(500).json({
                                success: true,
                                message: "Some order are not able to get placed, Please contact our team",
                                failedOrders,
                                successOrders
                            });

                        }
                    }

                }

            }

            if (failedOrders.length > 0) {

                return res.status(500).json({
                    success: false,
                    message: "Some order are not able to get placed, Please contact our team",
                    failedOrders,
                    successOrders
                });
            } else {

                return res.status(200).json({
                    success: true,
                    message: "Shipments created successfully"
                });
            }

        } else {
            return res.status(400).json({
                success: false,
                message: "Please upload a valid file"
            });
        }

    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }
}



clientController.getShipmentSummary = async (req, res, next) => {
    try {

        /**
         * get pickups 
         * 
         */
        let serviceProviders = await orders.aggregate([
            { $match: { clientId: req.user._id } },
            { $group: { _id: { serviceType: '$serviceType' }, total: { $sum: 1 } } },
            { $project: { serviceType: '$_id.serviceType', total: '$total', _id: 0 } }
        ])

        let pickupsSummary = await pickups.aggregate([
            { $match: { clientId: req.user._id } },
            { $group: { _id: { status: '$status' }, total: { $sum: 1 } } },
            { $project: { status: '$_id.status', total: '$total', _id: 0 } }
        ])

        let shipmentsSummary = await orders.aggregate([
            { $match: { clientId: req.user._id } },
            { $group: { _id: { status: '$status' }, total: { $sum: 1 } } },
            { $project: { status: '$_id.status', total: '$total', _id: 0 } }
        ])


        return res.status(200).json({
            success: true,
            data: {
                serviceProviders,
                pickupsSummary,
                shipmentsSummary
            }
        })



    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};
module.exports = clientController;