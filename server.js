'use strict';

// Adding node modules
const express = require('express');
const superagent= require('superagent');
const cors = require('cors');

const app = express();

app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Retrieves information about the location sent by the user using Google's Map API
app.get('/location', (request, response) => {
  // Checks for signs of life, will delete when finished
  console.log(request.query);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GOOGLE_API_KEY}`;
  return superagent.get(url)
    .then(result => {
      // Creates an object containing the data to return to the client
      const location = {
        search_query: request.query.data, // The user's input
        formatted_query: result.body.results[0].formatted_address, // City, state and country of the user's input
        latitude: result.body.results[0].geometry.location.lat, // Latitude of the user's input
        longitude: result.body.results[0].geometry.location.lng // Longitude of the user's input
      }
      response.send(location);
    })
})

// Creates Weather object
function Weather(day) {
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.forecast = day.summary;
}

// Creates Yelp object
function Yelp(data) {
  this.url = data.business[0].url;
  this.name = data.business[0].name;
  this.rating = data.business[0].rating;
  this.price = data.business[0].price;
  this.image_url = data.business[0].image_url;
}

// Ceeates The Movide DB object
function TMDB(data) {
  this.title = data.title;
  this.released_on = data.release_date;
  this.total_votes = data.vote_count;
  this.average_votes = data.vote_average;
  this.popularity = data.popularity;
  this.image_url = `https://image.tmdb.org/t/p/w500${data.backdrop_path}`;
  this. overview = data.overview;
}

