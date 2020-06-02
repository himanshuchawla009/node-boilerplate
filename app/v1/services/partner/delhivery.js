const rp = require('request-promise');

class Delivery {
    constructor() {
        this.apiUrl = "https://track.delhivery.com"
        this.token = "3c4ded446278de78e8d53cef2a1a191d64f6e347"

    }

    async checkPinCodeAvailable(pincode) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = `${this.apiUrl}/c/api/pin-codes/json/?token=${this.token}&filter_codes=${pincode}`;

                let options = {
                    method: 'GET',
                    uri: url,
                    json: true // Automatically stringifies the body to JSON
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })
    }

    async createWarehouse() {

    }

    async createWayBill() {
        return new Promise(async (resolve, reject) => {
            try {
                let url = `${this.apiUrl}/waybill/api/fetch/json/?token=${this.token}`;

                let options = {
                    method: 'GET',
                    uri: url,
                    json: true // Automatically stringifies the body to JSON
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })
    }

    async createOrder(shipments) {

        let orderDetails = shipments[0]
        let stringifiedShipment = JSON.stringify(shipments)

        return new Promise(async (resolve, reject) => {
            try {
                let body = `format=json&data={
                    "pickup_location": {
                        "name": "GAINT LOGISTIC"
                    },
                    "shipments": ${stringifiedShipment}
                }`

                console.log("body", body)
                let url = `${this.apiUrl}/api/cmu/create.json?format=json`;

                let headers = {
                    'Authorization': `Token ${this.token}`,
                    'content-type': 'application/json'
                }
                let options = {
                    method: 'POST',
                    uri: url,
                    headers,
                    body,
                    //json: true 
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })


    }

    async createPackingSlip(waybill) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = `${this.apiUrl}/api/p/packing_slip?wbns=${waybill}`;

                let headers = {
                    'Authorization': `Token ${this.token}`

                }
                let options = {
                    method: 'GET',
                    uri: url,
                    headers,
                    json: true // Automatically stringifies the body to JSON
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })

    }

    async createPickupRequest(pickup_time, pickup_date, expected_package_count) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = `${this.apiUrl}/​fm/request/new/`;

                let headers = {
                    'Authorization': `Token ${this.token}`

                }

                let body = {
                    "pickup_time": pickup_time,
                    "pickup_date": pickup_date,
                    "pickup_location": "GAINT LOGISTIC",
                    "expected_package_count": expected_package_count

                }
                let options = {
                    method: 'POST',
                    uri: url,
                    body: JSON.stringify(body),
                    headers,
                    json: true // Automatically stringifies the body to JSON
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })

    }


    async trackOrder(waybill) {

        return new Promise(async (resolve, reject) => {
            try {
                let url = `${this.apiUrl}/api/v1/packages/json/?waybill=${waybill}&verbose=2&token=${this.token}`;

                let options = {
                    method: 'GET',
                    uri: url,
                    json: true // Automatically stringifies the body to JSON
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })


    }



    async cancelOrder(waybill) {

        return new Promise(async (resolve, reject) => {
            try {
                let url = `${this.apiUrl}/api/p/edit`;
                let headers = {
                    'Authorization': `Token ${this.token}`

                }

                let body = {
                    "waybill": waybill,
                    "cancellation": "true"
                }
                let options = {
                    method: 'POST',
                    body,
                    uri: url,
                    headers,
                    json: true // Automatically stringifies the body to JSON
                };

                let apiRes = await rp(options)
                console.log(apiRes);
                resolve(apiRes);
            } catch (error) {
                reject(error);

            }
        })


    }









}

module.exports = Delivery;