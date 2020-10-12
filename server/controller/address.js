'use strict'
const { json } = require('body-parser');
const mongoose = require('mongoose');
const countries = require('../config/countries.json');
const modal = require('../model/address');
class address{
    async getLastRecord(){
        var result = await modal.findOne().sort({ field: 'asc', _id: -1 }).limit(1)
        console.log(result);
        return result;
    }
    async getRecordById(id){
        var result = await modal.findById(id);
        return result;
    }
    
    async getAddress(address_id, req,res ){
        try {
            
            var isAvailable = await modal.find({
              _id: address_id
            });
            
            if (isAvailable)
            {
                res.send(isAvailable ).json();
            }
            else
              res.sendStatus(404).json({
                message: `Address with ID: ${addressID} does not exists`
              })
      
          } catch (err) {
            res.json({
              message: `${err}`
            })
          }
    }
    async addAddress(country, city, street, postalcode, number, numberAddition, req, res){
        
        var countriesArray  = await countries.filter(function(o){
            if (o.Code === country )
              return o.Code
        })
        try {
            var isSaved = await modal({
                country: country,
                city: city,
                street: street,
                postalcode: postalcode,
                number: number,
                numberAddition: numberAddition,
                status: null, 
                name: null,
                email: null
              }).save();
      
              if (isSaved)
              {
                var result = await this.getLastRecord();  
                res.status(201).send({
                  result,
                  message: 'Address successfully added!'
                }).json();
              }
              else
              {
                res.status(409).send({
                    message: 'Faled to add Address!'
                  }).json();            
              }
        } 
        catch (err) 
        {
            console.log(err)
        }
    }
    
    async deleteAddress(id, req, res){
        console.log('Delete Address Called')
        try {
            var id = mongoose.Types.ObjectId(id);
            var isDeleted = await modal.findByIdAndDelete(id);
            if (isDeleted)
              res.sendStatus(204)
            else
            {
              res.sendStatus(404).send({
                message: `Failed to delete address with ID: ${id}`
              }).json();
              return;
            }  
          } catch (err) {
              console.log(err)
            // res.sendStatus(409).send(err).json()
          }
    }

    async pathAddress(req, res){
        try {
            const id = req.params.address_id;
            const { status, name, email} = req.body; 
            
            var isUpdated = await modal.findByIdAndUpdate(id,{
              status: status,
              name: name,
              email: email
            })
            
            if (isUpdated) {
              let result = await this.getRecordById(id); 
              res.status(200).send({
                result
              }).json()
            }
            else {
              res.status(403).send({
                message: `Failed to update address`
              }).json()
            }
          } catch (err) {
            res.send(err.message)
          }
    }
}

module.exports =  address;