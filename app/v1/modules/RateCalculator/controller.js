/**
 * Author: Himanshu Chawla
 */
const boom = require("boom"),
    logger = require("../../../../config/logger"),
    rateCalculatorService = require('../../services/rateCalculatorService');


rateController = Object.create(null);

rateController.calculateRate = async (req, res, next) => {
    try {

        /**
         * calculate shipment rate based on item weight and destination pin code 
         */

        let { destinationPincode, weight } = req.body;

        let { charge, estimatedDeliveryTime } = await rateCalculatorService.estimateDeliveryCharge(destinationPincode, weight);

        return res.status(200).json({
            success: true,
            data: {
                shipmentPrice: charge,
                estimatedDeliveryTime 
            }
        });
    }
    catch (err) {
        logger.error(err);
        return next(boom.badImplementation(err));
    }

};

module.exports = rateController;