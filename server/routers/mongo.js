'use strict';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const address = require('../model/address');

const MONGO_CONFIG = require('../config/mongo.js');
const cors = require('cors');

var _address = require('../controller/address');
const countries = require('../config/countries.json');


module.exports = function (app) {
  let router = express.Router();
  app.use(cors())

  // set up other middleware
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  const options = {
    ssl: false,
    sslValidate: false,
    poolSize: 1,
    socketTimeoutMS: 5000,
    // connectionTimeoutMS: 0,
    replicaSet: MONGO_CONFIG.MONGO_REPLICA_SET_NAME
  };
  let mongoConnect = `${MONGO_CONFIG.mongoURL}`
  mongoose.connect(mongoConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  }).catch(err => console.log(err.reason));


  let db = mongoose.connection;

  // db events
  db.on('error', (error) => {
    console.error(error);
  });

  db.on('close', () => {
    console.info('Lost connection');
  });
  db.on('reconnect', () => {
    console.info('Reconnected');
  });
  db.on('connected', () => {
    console.info(`Connection is established with mongodb, details: ${mongoConnect}`);
  });

  db.on('disconnected', async () => {
    console.info('Attempting to reconnect to MongoDB!');
    // Some duplication here, would be better to have in its own method
    await mongoose.connect(mongoConnect, options)
      .catch((err) => {
        if (err) console.error(err);
      });
  });

  /// address Section
  router.get('/address', (req, res) => {
    address.find(function (err, address) {
      if (err) {
        res.status(503).send(err);
      }
      res.json(address);
    });
  });

  router.get('/address/:address_id', async (req, res) => {
    try {
      var isAvailable = await address.find({
        _id: req.params.address_id
      });
      
      if (isAvailable)
        res.send(isAvailable ).json();
      else
        res.sendStatus(404).json({
          message: `Address with ID: ${addressID} does not exists`
        })

    } catch (err) {
      res.json({
        message: `${err}`
      })
    }

  });

  router.post('/address', async (req, res)=>{
      const {country, city, street, postalcode, number, numberAddition} = req.body;
      if ( country.length > 2){
        res.status(422).send({ message: 'Invalid Country'})
      }else {
      var countriesArray  = await countries.filter(function(o){
        if (o.Code === country ){
          return o.Code
        }
      });
      }
      
      try {
        var isSaved = await new address({
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
          var result = await getLastRecord();  
          res.status(201).send({
            result,
            message: 'Address successfully added!'
          }).json();
        }
        else
          res.status(409).send({
            message: 'Faled to add Address!'
          }).json();
      } catch (err) {
        console.log(err)
      }
      getLastRecord()
  })

  router.delete('/address/:address_id', async (req, res) => {
    try {
      var id = mongoose.Types.ObjectId(req.params.address_id);
      var isDeleted = await address.findByIdAndDelete(id);
      
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
      res.sendStatus(409).send(err).json()
    }

  });

  

  router.patch('/address/:address_id', async (req, res) => {
    console.log("Attempting to update an address")

    try {
      const id = req.params.address_id;
      const { status, name, email} = req.body; 
      
      var isUpdated = await address.findByIdAndUpdate(id,{
        status: status,
        name: name,
        email: email
      })
      
      if (isUpdated) {
        let result = await getRecordById(id); 
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
  });

  async function getRecordById(id){
    var result = await address.findById(id);
    return result;
  }
  async function getLastRecord(){
    var result = await address.findOne().sort({ field: 'asc', _id: -1 }).limit(1)
    console.log(result);
    
    return result;
  }

  app.use('/api', router);
};
