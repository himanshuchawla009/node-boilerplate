const { clients } = require('../../modules/AdminController/model');
const dao = require('../../modules/AdminController/dao');


const authenticateClient = async(req, res, next) => {
    try {
        let  apiKey = req.headers['x-api-key']
        let clientDetails = await dao.findOne({model:clients,  params:{apiKey }});

        if(!!clientDetails) {
            req.user = clientDetails;
            return next()

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid api key"
            });
        }

    } catch (error) {
        throw error;
    }

}

module.exports={ authenticateClient }