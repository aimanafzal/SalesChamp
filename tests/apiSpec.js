const Movie = require('../server/model/movie');
const Genre = require('../server/model/genre');
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

describe('#AddMovies()', function () {
    it('respond with a pass or fail', function (done) {
        const movie = new Movie({
            name: "JamesBond Returns",
            description: "In search of diamonds",
            releaseDate: "30/05/2020",
            genre: "Action",
            duration: "90 minutes",
            rating: "7"

        });

        movie.save((err, res) => {
            if (err)
                return done(err);
            else
                return done();
        });

    });
});


describe('#GetMovies()', function () {
    it('respond with returning records', function (done) {
        Movie.find((err, res) => {
            if (err) return done(err);

            if (res.length >= 1)
                return done();
        });
    });
});


describe('#Update a movie()', function () {
    it('Respond with updating a movie with pass or fail', function (done) {
        var movies = Movie.find({})
        if (movies.length >= 1) {

            var id = movies[0]._id
            Movie.findByIdAndUpdate(
                id,
                {
                    "name": "Tom and Jerry Part 3"
                }, {
                safe: true,
                upsert: true,
                new: true,
            }, (err, res) => {
                if (res)
                    return done();
                else return done(err)
            })
        }
    });
});

describe('#Delete a movie', function () {
    it('Respond with deleting a movie with pass or fail', function (done) {
        var movies = Movie.find({})
        if (movies.length >= 1) {

            var id = movies[0]._id
            Movie.findByIdAndDelete(id,(err,res) => {
                if (err)
                    return done(err);
                else
                    return done()
            });
        }
    });
});

describe('#Delete all movies', function () {
    it('Respond with deleting all movies with pass or fail', function (done) {

        Movie.deleteMany({},(err) => {
            if (err)
                return done(err);
            else
                return done()
        });
    });

});

// Genres
describe('#AddGenres()', function () {
    it('respond with a pass or fail', function (done) {

        const movie = new Genre({
            name: "Action",
            description: "Action",
        });

        movie.save((err, res) => {
            if (err)
                return done(err);
            else
                return done();
        });

    });
});

describe('#GetGenres', function () {
    it('respond with returning all genres', function (done) {
        Genre.find((err, res) => {
            if (err) return done(err);

            if (res.length >= 1)
                return done();
        });
    });
});

describe('#Update a genre', function () {
    it('Respond with updating a genre with pass or fail', function (done) {
        var genres = Genre.find({})
        if (genres.length >= 1) {

            var id = genres[0]._id
            Genre.findByIdAndUpdate(
                id,
                {
                    "name": "Action/Suspense"
                }, {
                safe: true,
                upsert: true,
                new: true,
            }, (err, res) => {
                if (err)
                    return done(err);
                else
                    return done();
            });
        }
    });
});

describe('#Delete a genre', function () {
    it('Respond with deleting a genre with pass or fail', async function (done) {
        var genres = await Genre.find({})
        if (genres.length >= 1) {

            var id = genres[0]._id
            var isDeleted = await Genre.findByIdAndDelete(id)
            if (isDeleted)
                return done();
            return done();
        }
    });
});

describe('#Delete all genres', function () {
    it('Respond with deleting all movies with pass or fail', async function (done) {
        var isDeleted = await Genre.deleteMany({})
        if (isDeleted)
            return done();
        return done();

    });
});