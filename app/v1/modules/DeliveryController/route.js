const controller = require("./controller"),
	{ celebrate } = require('celebrate'),
	{ authenticateClient } = require('../../middlewares/auth/clientAuth');
validateSchema = require("./schema");





module.exports = function (router) {


	/**
	   * @swagger
	   * /delivery/checkPincode:
	   *   get:
	   *     description: Api to check pin code availablity
	   *     tags:
	   *       - Delivery
	   *     produces:
	   *       - application/json
	   *     parameters:
	   *       - name: pincode
	   *         description: pincode of city
	   *         in: params
	   *         required: true
	   *         type: string
	   *     responses:
	   *       200:
	   *        	description: Success message
	   */
	router.get('/delivery/checkPincode',
		authenticateClient,
		controller.checkPincode
	);



	/**
	   * @swagger
	   * /delivery/generateWayBill:
	   *   get:
	   *     description: Api to generate way bill number
	   *     tags:
	   *       - Delivery
	   *     produces:
	   *       - application/json
	   *     responses:
	   *       200:
	   *        	description: Success message
	   */
	router.get('/delivery/generateWayBill',
		authenticateClient,
		controller.generateWayBill
	);
	/**
		   * @swagger
		   * /delivery/createOrder:
		   *   get:
		   *     description: Api to create order
		   *     tags:
		   *       - Delivery
		   *     produces:
		   *       - application/json
		   *     responses:
		   *       200:
		   *        	description: Success message
		   */
	router.post('/delivery/createOrder',
		authenticateClient,
		celebrate(validateSchema.createOrder),
		controller.generateOrder
	);




	/**
	 * @swagger
	 * /delivery/generatePickupRequest:
	 *   get:
	 *     description: Api to generate pickup requests
	 *     tags:
	 *       - Delivery
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *        	description: Success message
	 */
	router.post('/delivery/generatePickupRequest',
		authenticateClient,
		celebrate(validateSchema.pickupRequest),
		controller.generatePickupRequest
	);








	/**
	 * @swagger
	 * /delivery/generatePackingSlip/:wayBillNumber:
	 *   get:
	 *     description: Api to generate packing slip using way bill number
	 *     tags:
	 *       - Delivery
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *        	description: returns packing slip data
	 */
	router.get('/delivery/generatePackingSlip/:waybill',
		authenticateClient,
		controller.generatePackingSlip
	);

	/**
	 * @swagger
	 * /delivery/trackOrder:
	 *   get:
	 *     description: Api to track order using way bill number
	 *     tags:
	 *       - Delivery
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *        	description: returns order status
	 */
	router.get('/delivery/trackOrder/:waybill',
		authenticateClient,
		controller.trackOrder
	);


	router.get('/delivery/cancelOrder/:waybill',
		authenticateClient,
		controller.cancelOrder
	);

	router.get('/delivery/getOrders',
		authenticateClient,
		controller.getOrders
	);
	router.get('/delivery/getPickups',
		authenticateClient,
		controller.getPickups
	);

	router.get('/delivery/getOrderByWayBill',
		authenticateClient,
		controller.getOrderByWayBill
	);

	router.get('/delivery/getPickupById',
		authenticateClient,
		controller.getPickupById
	);

}