const rp = require('request-promise'),
    { pickups, wayBills, pincodes, orders, shipments } = require('../../modules/DeliveryController/model'),
    dao = require('../../modules/DeliveryController/dao')
class DTDC {
    constructor() {

        this.service = 'DTDC'

    }

    async checkPinCodeAvailable(pincode) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await dao.findOne({
                    model: pincodes, params: {
                        pin: pincode,
                        service: this.service
                    }
                });
                resolve(data);
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
                if(!!waybillData) {
                    let waybill = waybillData.waybill;

                    resolve(waybill);

                } else {
                    reject("DTDC service temporarily not available")
                }

            } catch (error) {
                reject(error);

            }
        })
    }

    async createOrder(shipments, order) {


        return new Promise(async (resolve, reject) => {
            try {

                await dao.create({ model: orders, obj: order })
                await dao.insert({ model: shipments, docArray: shipments })

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
                await dao.update({
                    model: shipments, query: {
                        service: this.service,
                        waybill
                    }, params: {
                        status: 'CANCELLED'
                    }, options: {
                        multi: true
                    }
                })
            } catch (error) {
                reject(error);

            }
        })


    }









}

module.exports = DTDC;