var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var orderSchema = new Schema({
  "pickUpLocation": {
    type: String,
    required: true
  },
  "clientId": {
    type: Schema.Types.ObjectId, 
    ref: 'Clients',
    required: true
  },
  "orderId": {
    type: String,
    required: true
  },
  "waybill": {
    type: String,
    required: true
  },
  "serviceType": {
    type: String,
    enum: ['DTDC', 'DELHIVERY'],
    required: true
  },
  "shipments": {
    type: Array,
    required: true
  },
  "status":{
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


var shipmentSchema = new Schema({
  "waybill": {
    type: String,
    required: true
  },
  "weight": {
    type: Number,
    required: true
  },
  "order": {
    type: String,
    required: true
  },
  "phone": {
    type: Number,
    required: true
  },
  "products_desc": {
    type: String,
    required: true
  },
  "cod_amount": {
    type: Number,
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
    type: Number,
    required: true
  },
  "quantity": {
    type: Number,
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
  "status":{
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

var waybillSchema = new Schema({
  wayBill: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum:['ALLOTED','PROCESSING','AVAILABLE'],
    default:'AVAILABLE'
  },
  service: {
    type: String,
    enum:['DTDC'],
    required: true
  },
  allotedOrderId: {
    type: String,
    default: null
  },
  allotedUserId: {
    type: String,
    default: null
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

var pinCodeSchema = new Schema({
  "covid_zone": {
    type: Boolean,
    required: true
  },
  "service": {
    type: String,
    required: true,
    enum:['DTDC','DELHIVERY']
  },
  "pin": {
    type: Number,
    required: true
  },
  "max_amount": {
    type: String,
    required: true
  },
  "pre_paid": {
    type: String,
    required: true,
    enum:['Y','N']
  },
  "cash": {
    type: String,
    required: true,
    enum:['Y','N']
  },
  "pickup": {
    type: String,
    required: true,
    enum:['Y','N']
  },
  "cod": {
    type: String,
    required: true,
    enum:['Y','N']
  },
  "country_code": {
    type: String,
    required: true,
  },
  "district": {
    type: String,
    required: true,
  },
  "state_code": {
    type: String,
    required: true,
  },
  "max_weight": {
    type: String,
    required: true,
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})


var pickUpSchema = new Schema({
  "status": {
    type: String,
    enum: ["PICK_UP_REQUEST_CREATED", "PICK_UP_REQUEST_ACCEPTED", "PICKED_UP_BY_GAINT_LOGISTICS", "PICKED_UP_BY_DELIVERY"],
    required: true
  },
  "clientId": {
    type: Schema.Types.ObjectId, 
    ref: 'Clients',
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
var wayBills = mongoose.model('WayBills', waybillSchema, 'WayBills');
var shipments = mongoose.model('Shipments', shipmentSchema, 'Shipments');
var pincodes = mongoose.model('Pincodes', pinCodeSchema, 'Pincodes');

module.exports = { orders, pickups,wayBills, shipments, pincodes };



