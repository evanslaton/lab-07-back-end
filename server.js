'use strict';

// Adding node modules
const express = require('express');
const superagent= require('superagent');
const cors = require('cors');

const app = express();

app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Retrieves information about the location sent by the user using Google's Map API
app.get('/location', (request, response) => {
  // Checks for signs of life, will delete when finished
  console.log(request.query);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GOOGLE_API_KEY}`;
  return superagent.get(url)
    .then(result => {
      // Creates an object containing the data to return to the client
      const location = {
        search_query: request.query.data, // Location the user is requesting data for
        formatted_query: result.body.results[0].formatted_address, // City, state and country of the user's input
        latitude: result.body.results[0].geometry.location.lat, // Latitude of the user's input
        longitude: result.body.results[0].geometry.location.lng // Longitude of the user's input
      }
      response.send(location);
    })
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

