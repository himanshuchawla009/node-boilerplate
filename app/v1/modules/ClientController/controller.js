/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    uuid = require('uuid'),
    bcrypt = require('bcryptjs'),
    dao = require('./../AdminController/dao'),
    { clients } = require('./../AdminController/model'),
    logger = require("../../../../config/logger");
const presets = require("../../../../utils/presets");
const jwt = require('jsonwebtoken');



clientController = Object.create(null);

clientController.register = async (req, res, next) => {
    try {

        /**
         * saving new client along with api key in db
         * 
         */
        let { clientName, clientEmail, pincode, city, address, state, country, phone, password } = req.body;

        let clientDetails = await dao.findOne({ model: clients, params: {  clientEmail: clientEmail } });
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

module.exports = clientController;