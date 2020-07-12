const rp = require('request-promise'),
    rateCalculatorService = require('../../services/rateCalculatorService'),
    { pickups, wayBills, pincodes, orders, shipments } = require('../../modules/DeliveryController/model'),
    dao = require('../../modules/DeliveryController/dao')
class DTDC {
    constructor() {

        this.service = 'DTDC'

    }

    async checkPinCodeAvailable(pincode) {
        return new Promise(async (resolve, reject) => {
            try {
                await rateCalculatorService.estimateDeliveryCharge(pincode, 10);
                resolve(true);
            } catch (error) {
                reject(error);

            }
        })
    }



    async createWayBill() {
        return new Promise(async (resolve, reject) => {
            try {
                let waybillData = await dao.findOneAndUpdate({
                    model: wayBills,
                    query: {
                        service: this.service,
                        status: 'AVAILABLE'
                    },
                    params: {
                        status: 'PROCESSING'
                    }

                });
                console.log("way bill data", waybillData)
                if (!!waybillData) {
                    let waybill = waybillData.wayBill;

                    resolve({
                        status: true,
                        waybill
                    });

                } else {
                    resolve({
                        status: false
                    })
                }

            } catch (error) {
                reject(error);

            }
        })
    }

    async createOrder(allShipments, order) {


        return new Promise(async (resolve, reject) => {
            try {

                await dao.create({ model: orders, obj: order })
                await dao.insert({ model: shipments, docArray: allShipments })

                resolve(true);
            } catch (error) {
                reject(error);

            }
        })


    }

    async createPackingSlip(waybill) {
        return new Promise(async (resolve, reject) => {
            try {

            } catch (error) {
                reject(error);

            }
        })

    }

    async createPickupRequest(pickup_time, pickup_date, expected_package_count) {
        return new Promise(async (resolve, reject) => {
            try {

            } catch (error) {
                reject(error);

            }
        })

    }


    async trackOrder(waybill) {

        return new Promise(async (resolve, reject) => {
            try {

                let status = await dao.find({
                    model: shipments, query: {
                        service: this.service,
                        waybill
                    }
                })
                resolve(status)
            } catch (error) {
                reject(error);

            }
        })


    }



    async cancelOrder(waybill) {

        return new Promise(async (resolve, reject) => {
            try {
                await dao.findOneAndUpdate({
                    model: orders, query: {
                        service: this.service,
                        waybill
                    }, params: {
                        status: 'CANCELLED'
                    }, options: {
                        multi: true
                    }
                })
                resolve(true)
            } catch (error) {
                reject(error);

            }
        })


    }









}

module.exports = DTDC;