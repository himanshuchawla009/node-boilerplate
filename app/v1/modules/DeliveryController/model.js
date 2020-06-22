var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var orderSchema = new Schema({
  "pickUpLocation": {
    type: String,
    required: true
  },
  "clientId": {
    type: String,
    required: true
  },
  "shipments":{
    type: Array,
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

module.exports = { orders, pickups };



