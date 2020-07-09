const { clients } = require('../../modules/AdminController/model');
const dao = require('../../modules/AdminController/dao');

const bcrypt = require('bcryptjs');
const presets = require("../../../../utils/presets");
const jwt = require('jsonwebtoken');

const authenticateClient = async (req, res, next) => {
    try {
        let apiKey = req.headers['x-api-key']
        if (!!apiKey) {
            let clientDetails = await dao.findOne({ model: clients, params: { apiKey } });

            if (!!clientDetails) {
                req.user = clientDetails;
                return next()

            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid api key"
                });
            }
        }

        else if (!!req.headers["x-auth-token"]) {
            const token = req.headers["x-auth-token"];
            const decoded = jwt.verify(token, presets.JWT_KEY, null);
            console.log(decoded, "decoded")
            if (decoded.userType === 'client') {
                req.userData = decoded;
                let clientDetails = await dao.findOne({ model: clients, params: { _id : decoded.userId } });

                
                req.user = clientDetails
                next();
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Invalid/expired token"
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid/expired token or api key"
            });
        }



    } catch (error) {
        throw error;
    }

}

module.exports = { authenticateClient }