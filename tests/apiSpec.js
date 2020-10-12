const modal = require('../server/model/address');
const MONGO_CONFIG = require('../server/config/mongo.js');
const mongoose = require('mongoose');

let mongoConnect = `${MONGO_CONFIG.mongoURL}`

describe('Connection', function () {
    mongoose.connect(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    }).catch(err => console.log(err.reason));
})

describe('#AddAddress()',  function () {
    it('respond with a pass or fail', async function (done) {
         var data = await new modal({
            country: country,
                city: "Karachi",
                street: "G.Iqbal",
                postalcode: "75300",
                number: 6,
                numberAddition: 1,
                status: null, 
                name: null,
                email: null

        });

        await data.save((err, res) => {
            if (err)
                return done(err);
            else
                return done();
        });

    });
});


describe('#GetAddress()', function () {
    it('respond with returning records', async function (done) {
       await modal.find((err, res) => {
            if (err) 
                return done(err);
            return done();
        });
    });
});


describe('#Update a single address()',  function () {
    it('Respond with updating a address with pass or fail', async function (done) {
        var _address = await modal.find({})
        if (_address.length >= 1) {

            var id = _address[0]._id
            await modal.findByIdAndUpdate(
                id,
                {
                    "name": "Brian"
                }, {
                safe: true,
                upsert: true,
                new: true,
            }, (err, res) => {
                if (res)
                    return done();
                return done(err)
            })
        }
    });
});

describe('#Delete an address', function () {
    it('Respond with deleting a single address with pass or fail', async function (done) {
        var _address = modal.find({})
        if (_address.length >= 1) {
            var id = _address[0]._id
            await modal.findByIdAndDelete(id,(err,res) => {
                if (err)
                    return done(err);
                return done()
            });
        }
    });
});



describe('#Update an address', function () {
    it('Respond with updating an address with pass or fail', async function (done) {
        var _address = modal.find({})
        if (_address.length >= 1) {

            var id = _address[0]._id
            await modal.findByIdAndUpdate(
                id,
                {
                    name: "Brian Tom",
                    status:"Not available",
                    email: "brian@xyz.com"
                }, {
                safe: true,
                upsert: true,
                new: true,
            }, (err, res) => {
                if (err)
                    return done(err);
                return done();
            });
        }
    });
});
