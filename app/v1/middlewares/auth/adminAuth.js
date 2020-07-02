const { admins } = require('../../modules/AdminController/model');
const dao = require('../../modules/AdminController/dao');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const presets = require("../../../../utils/presets");
const jwt = require('jsonwebtoken');

const authenticateAdmin = async (req, res, next) => {
    try {

        if (!!req.headers["x-auth-token"]) {
            const token = req.headers["x-auth-token"];
            const decoded = jwt.verify(token, presets.JWT_KEY, null);
            console.log(decoded,"decoded")
            if (decoded.userType === 'admin') {
                req.userData = decoded;
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
                message: "Invalid/expired token"
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid/expired token"
        });
    }    

}


const loginAdmin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let adminDetails = await dao.findOne({ model: admins, params: { email } });

        if (!!adminDetails) {
            const isPasswordMatch = await bcrypt.compare(
                password,
                adminDetails.password
            );
            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }
            const token = await jwt.sign(
                {
                    email: email,
                    userId: adminDetails._id,
                    userType: 'admin'
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


    } catch (error) {
        throw error;
    }
}

(async () => {
    try {
        console.log("generating super admin",process.env.adminEmail)
        let email = process.env.adminEmail;
        let password = process.env.adminPassword;
        let adminDetails = await dao.findOne({ model: admins, params: { email } });
        if (!!adminDetails) {
            console.log("admin already exists")
        } else {
            const hash = await bcrypt.hash(password, 10);
            let adminObj = {
                email,
                password: hash
            }
            await dao.create({ model: admins, obj: adminObj });
        }



    } catch (error) {
        throw error;
    }
})()

module.exports = {
    loginAdmin,
    authenticateAdmin
}