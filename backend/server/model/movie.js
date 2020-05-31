'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  name: String,
  description: String,
  releaseDate: String,
  genre: String,
  duration: String,
  rating: String
})
module.exports = mongoose.model('Movie', MovieSchema)

