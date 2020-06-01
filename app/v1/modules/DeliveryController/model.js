var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var orderSchema = new Schema({
  "waybill": {
    type: String,
    required: true
  },
  "order": {
    type: String,
    required: true
  },
  "phone": {
    type: String,
    required: true
  },
  "products_desc": {
    type: String,
    required: true
  },
  "cod_amount": {
    type: String,
    required: true
  },
  "name": {
    type: String,
    required: true
  },
  "country": {
    type: String,
    required: true
  },
  "order_date": {
    type: String,
    required: true
  },
  "total_amount": {
    type: String,
    required: true
  },
  "add": {
    type: String,
    required: true
  },
  "pin": {
    type: String,
    required: true
  },
  "quantity": {
    type: String,
    required: true
  },
  "payment_mode": {
    type: String,
    required: true
  },
  "state": {
    type: String,
    required: true
  },
  "city": {
    type: String,
    required: true
  },
  "clientId": {
    type: String,
    required: true
  },
  "weight": {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});






var pickUpSchema = new Schema({
  "status": {
    type: String,
    enum: ["PICK_UP_REQUEST_CREATED", "PICK_UP_REQUEST_ACCEPTED", "PICKED_UP_BY_GAINT_LOGISTICS", "PICKED_UP_BY_DELIVERY"],
    required: true
  },
  "clientId": {
    type: String,
    required: true
  },
  "pickupTime": {
    type: String
  },
  "pickupDate": {
    type: String
  },
  "expectedPackageCount": {
    type: String,
  }

})

var orders = mongoose.model('Orders', orderSchema, 'Orders');
var pickups = mongoose.model('Pickups', pickUpSchema, 'Pickups');

module.exports = {orders,pickups};



