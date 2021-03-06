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
      const location = new GoogleMap(request, result);

      response.send(location);
    })
})

app.get('/weather', (request, response) => {
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  return superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map((day) => new Weather(day));
      response.send(weatherSummaries);
    })
})

app.get('/yelp', (request, response) => {
  const url = `https://api.yelp.com/v3/businesses/search?location=${request.query.data.search_query}`;
  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(result => {
      const restaurants = result.body.businesses.map((business) => new Yelp(business));

      response.send(restaurants);
    })
})

app.get('/movies', (request, response) => {
  const url = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US&page=1&query=${request.query.data.search_query}`;
  superagent.get(url)
    .then(result => {
      // console.log(result.body.results);
      const movies = result.body.results.map((movie) => {
        console.log(movie);
        return new TMDB(movie);
      });

      response.send(movies);
    })
})

// Creates location object
function GoogleMap(request, result) {
  this.search_query = request.query.data;
  this.formatted_query = result.body.results[0].formatted_address;
  this.latitude = result.body.results[0].geometry.location.lat;
  this.longitude = result.body.results[0].geometry.location.lng;
}

// Creates weather object
function Weather(day) {
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.forecast = day.summary;
}

// Creates Yelp object
function Yelp(data) {
  this.url = data.url;
  this.name = data.name;
  this.rating = data.rating;
  this.price = data.price;
  this.image_url = data.image_url;
}

// Ceeates The Movide DB object
function TMDB(data) {
  this.title = data.title;
  this.released_on = data.release_date;
  this.total_votes = data.vote_count;
  this.average_votes = data.vote_average;
  this.popularity = data.popularity;
  this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  this.overview = data.resultoverview;
}

