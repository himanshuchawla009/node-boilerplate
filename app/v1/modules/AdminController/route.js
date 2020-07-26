const controller = require("./controller"),
	{ celebrate } = require('celebrate'),
	validateSchema = require("./schema"),
	{ authenticateAdmin, loginAdmin } = require('../../middlewares/auth/adminAuth')





module.exports = function (router) {


	/**
	   * @swagger
	   * /admin/createClient:
	   *   post:
	   *     description: Api to generate client
	   *     tags:
	   *       - Clients
	   *     produces:
	   *       - application/json
	   *     parameters:
	   *       - name: clientName
	   *         description: name of the client
	   *         in: body
	   *         required: true
	   *         type: string
	   *     responses:
	   *       200:
	   *        	description: Success message
	   */
	router.post('/admin/generateClient',
		authenticateAdmin,
		celebrate(validateSchema.generateClient),
		controller.createClient
	);

	/**
	 * @swagger
	 * /admin/fetchClientKey:
	 *   post:
	 *     description: Api to fetch client key
	 *     tags:
	 *       - Clients
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: name
	 *         description: name of the client
	 *         in: params
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *        	description: Success message
	 */
	router.get('/admin/fetchClientKey/:name',
		authenticateAdmin,
		controller.fetchClientApiKey
	);

	router.post('/admin/login',
		celebrate(validateSchema.adminLogin),
		loginAdmin
	);

	router.post('/admin/updatePickupRequest',
		authenticateAdmin,

		celebrate(validateSchema.updatePickupRequest),
		controller.updatePickupRequest
	);

	router.post('/admin/updateShipmentStatus',
		authenticateAdmin,

		celebrate(validateSchema.updateShipmentStatus),
		controller.updateShipmentStatus
	);

	router.post('/admin/addPincode',
		authenticateAdmin,
		celebrate(validateSchema.addPincode),
		controller.addPincode
	);

	router.post('/admin/addWayBill',
		authenticateAdmin,

		celebrate(validateSchema.addWayBill),
		controller.addWayBill
	);

	router.post('/admin/addWayBillSeries',
		authenticateAdmin,
		celebrate(validateSchema.addWayBillSeries),
		controller.addWayBillSeries
	);

	
	router.get('/admin/fetchPincodes',
		authenticateAdmin,
		controller.fetchPincodes
	);

	router.get('/admin/fetchWayBills',
		authenticateAdmin,
		controller.fetchWayBills
	);

	router.get('/admin/getAllUsers',
		authenticateAdmin,
		controller.getAllUsers
	);
	router.get('/admin/getPickups',
		authenticateAdmin,
		controller.getPickups
	);

	router.get('/admin/getOrders',
		authenticateAdmin,
		controller.getOrders
	);

	router.get('/admin/getShipmentsSummary',
		authenticateAdmin,
		controller.getShipmentSummary
	);

	router.delete('/admin/deleteClient',
		authenticateAdmin,
		controller.deleteClient
	);

	router.delete('/admin/deleteWaybill',
		authenticateAdmin,
		controller.deleteWaybill
	);



}