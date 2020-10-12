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

  router.get('/test', (req, res)=>{
    var obj = new _address(); 
    console.log( obj.get());
  })
  
  router.get('/address/:address_id', async (req, res) => {
    var obj = new _address(); 
    obj.getAddress(req.params.address_id, req, res);
  });

  router.post('/address', async (req, res)=>{
    try {
      const {country, city, street, postalcode, number, numberAddition} = req.body;
      if ( country.length > 2){
        res.status(422).send({ message: 'Invalid Country'})
      }else {
        var obj = new _address();
        obj.addAddress(country, city, street, postalcode, number, numberAddition, req, res);
      }
    } catch (err) {
      res.send(err.message)
    }  
  })

  router.delete('/address/:address_id', async (req, res) => {
    try {
      var obj = new _address();
      obj.deleteAddress(req.params.address_id, req, res);  
    } catch (err) {
      res.send(err.message)
    }
    
  });

  

  router.patch('/address/:address_id', async (req, res) => {
    console.log("Attempting to update an address")

    try {
      var obj = new _address();
      obj.pathAddress(req, res);

    } catch (err) {
      res.send(err.message)
    }
  });

  app.use('/api', router);
};
