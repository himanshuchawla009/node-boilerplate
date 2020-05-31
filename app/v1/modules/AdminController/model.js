var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var clientAccessSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    }


}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

var adminSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }


}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

var clients = mongoose.model('Clients', clientAccessSchema, 'Clients');
var admins = mongoose.model('Admins', adminSchema, 'Admins');

module.exports = {
    admins,
    clients
};



