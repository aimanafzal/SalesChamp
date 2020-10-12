'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressSchema = new Schema
({
    id:String,
    country:String,
    city:String,
    street:String,
    postalCode:String,
    number:{
        type     : Number,
        required : true,
        unique   : true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    },
    numberAddition:String,
    status:String,
    name:String,
    email:String
}, {timestamps: true, versionKey:false})

module.exports =  mongoose.model('address',  addressSchema)
