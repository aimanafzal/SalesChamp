'use strict';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const Movie = require('../model/movie');
const Genre = require('../model/genre');
const MONGO_CONFIG = require('../config/mongo.js');
const cors = require('cors');


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
    connectionTimeoutMS: 0,
    replicaSet: MONGO_CONFIG.MONGO_REPLICA_SET_NAME
  };

  let mongoConnect = `mongodb://${MONGO_CONFIG.mongoURL}:27017`;

  mongoose.Promise = global.Promise;
  mongoose.connect(mongoConnect, options)
    .catch((err) => {
      if (err) console.error(err);
    });

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

  /// Movies Section
  router.get('/movies', (req, res) => {
    Movie.find(function (err, movies) {
      if (err) {
        res.status(503).send(err);
      }
      res.json(movies);
    });
  });

  router.post('/movies', async (req, res) => {
    console.log(`Creating Movie`);
    const name = req.body.name;
    const description = req.body.description;
    const releaseDate = req.body.releaseDate;
    const genre = req.body.genre;
    const duration = req.body.duration;
    const rating = req.body.rating;
    console.log(`Creating Movie for ${req.body.name} ${description}`);
    if (!name || !description) {
      res.status(422).send("Unprocessable Entity");
      return;
    }
    const movie = new Movie({

      name: name,
      description: description,
      releaseDate: releaseDate,
      genre: genre,
      duration: duration,
      rating: rating

    });


    try {
      var isSaved = await movie.save()
      if (isSaved)
        res.status(200).send({
          message: 'Movie successfully added!'
        }).json();
      else
        res.status(409).send({
          message: 'Faled to add a movie!'
        }).json();
    } catch (err) {
      console.log(err)
    }


  });

  router.put('/movies/:movie_id', async (req, res) => {
    const movieID = req.params.movie_id
    console.log(`Attempting to update a movie by ID (${movieID})`)
    try {
      var isUpdated = await Movie.findByIdAndUpdate(
        req.params.movie_id,
        req.body, {
        safe: true,
        upsert: true,
        new: true
      })
      if (isUpdated)
        res.json({
          message: `Updated movie ${movieID}`
        })
      else
        res.json({
          message: `Failed to update movie with ID: ${movieID}`
        })

    } catch (err) {
      res.json({
        message: `${err}`
      })
    }
  });

  router.delete('/movies/:movie_id', async (req, res) => {
    try {
      var isDeleted = await Movie.findByIdAndDelete({
        _id: req.params.movie_id
      });

      if (isDeleted)
        res.send(200).json({
          message: `Movie Deleted with Id: ${movieID}`
        })
      else
        res.send(503).json({
          message: `Failed to delete movie with ID: ${movieID}`
        })

    } catch (err) {
      res.json({
        message: `${err}`
      })
    }

  });

  router.delete('/movies', async (req, res) => {
    console.log("Attempting to delete all movies")

    try {
      var isDeleted = await Movie.deleteMany({})

      if (isDeleted) {
        console.log(`Is Deleted`)
        res.status(200).send().json({
          message: `All Movies Deleted `
        })
      }
      else {
        res.status(503).send({
          message: `Failed to delete movies`
        }).json()
      }
    } catch (err) {
      // res.json({
      //   message: `${err}`
      // })
    }
  });


  /// Genre Section 
  router.get('/genres', async (req, res) => {
    var genres = await Genre.find()
    try {
      if (genres) {
        res.status(200).send({
          genres
        })
      }
      else {
        res.status(500).send({ message: `Failed to fetch genres` }).json()
      }
    } catch (err) {
      res.json({
        message: `${err}`
      })
    }
  });

  router.post('/genres', async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    console.log(`Creating Genre for ${req.body.name} ${req.body.description} `);

    if (!name || !description) {
      res.status(422).send("Unprocessable Entity");
      return;
    }
    try {
      const genre = new Genre({
        name: name,
        description: description
      });
      var genreSaved = await genre.save()

      if (genreSaved) {
        res.status(200).send({
          message: 'Genre successfully added!'
        }).json();
      }
      else {
        res.status(500).send({
          message: 'Failed to add genre!'
        }).json();
      }
    } catch (err) {
      res.json({
        message: `${err}`
      })
    }


  });

  router.put('/genres/:genre_id', async (req, res) => {
    const genreID = req.params.genre_id
    console.log(`Attempting to update a genre by ID (${genreID})`)

    try {
      var isUpdated = await Genre.findByIdAndUpdate(
        req.params.genre_id,
        req.body, {
        safe: true,
        upsert: true,
        new: true
      })

      if (isUpdated) {
        res.status(200).send({ message: 'Genre updated successfully!' })
      }
      else {
        res.status(500).send({ message: 'Failed to update genre !' })
      }
    } catch (err) {

    }


  });

  router.delete('/genres/:genre_id', async (req, res) => {

    try {
      var genreId = req.params.genre_id
      var isDeleted = await Genre.findByIdAndDelete({
        _id: req.params.genre_id
      });

      if (isDeleted)
        res.send(200).json({
          message: `Genere Deleted with Id: ${genreId}`
        })
      else
        res.send(409).json({
          message: `Failed to delete genre with ID: ${genreId}`
        })

    } catch (err) {
      res.json({
        message: `${err}`
      })
    }

  });

  router.delete('/genres', async (req, res) => {
    console.log("Attempting to delete all genres")

    var isDeleted = await Genre.deleteMany({})

    try {

      if (isDeleted)
        res.send(200).json({
          message: `Generes Deleted`
        })
      else
        res.send(409).json({
          message: `Failed to delete genres`
        })

    }
    catch (err) {
      console.log(err)
    }





  });
  app.use('/api', router);
};
