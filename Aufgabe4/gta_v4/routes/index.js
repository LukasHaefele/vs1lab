// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const e = require("express");
const GeoTagStorageObject = new GeoTagStore()

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', {
      taglist: GeoTagStorageObject.getAllGeoTags(),
      latcoord: "",
      longcoord: "",
      geoTagList: JSON.stringify(GeoTagStorageObject.getAllGeoTags())
  })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get('/api/geotags', (req, res) => {
  returnList = GeoTagStorageObject.getAllGeoTags();
  const searchterm = req.body.keyword;
  if(searchterm !== undefined){
    const lat = req.body.latHidden;
    const long = req.body.longHidden;
    if(lat !== undefined && long !== undefined){
      returnList = GeoTagStorageObject.searchNearbyGeoTags({'lat':lat,'long':long},searchterm);
    }else{
      returnList = GeoTagStorageObject.getAllGeoTags().filter(element => (element.name === searchterm || element.hashtag === searchterm));
    }
  }
  res.render('index', {
    taglist: returnList,
    latcoord: "",
    longcoord: "",
    geoTagList: JSON.stringify(returnList)
  })
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...


router.post('/api/geotags', function (req, res, next) {
  //todo: location in storage reinschreiben
  if (req.body.lat !== undefined && req.body.long !== undefined) {
      const newLoc = new GeoTag([req.body.name, req.body.lat, req.body.long, req.body.hashtag])
      GeoTagStorageObject.addGeoTag(newLoc)
      res.render('index', {
          taglist: GeoTagStorageObject.getAllGeoTags(),
          latcoord: req.body.lat,
          longcoord: req.body.long,
          geoTagList: JSON.stringify(GeoTagStorageObject.getNearbyGeoTags(newLoc))
      })
  } else {
      res.render('index', {
          taglist: GeoTagStorageObject.getAllGeoTags(),
          latcoord: req.body.lat,
          longcoord: req.body.long,
          geoTagList: JSON.stringify(GeoTagStorageObject.getAllGeoTags())
      })
  }

})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

module.exports = router;
