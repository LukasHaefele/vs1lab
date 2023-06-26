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
    console.log(GeoTagStorageObject.getAllGeoTags());
    res.render('index', {
        taglist: GeoTagStorageObject.getAllGeoTags(),
        latcoord: "",
        longcoord: "",
        geoTagList: JSON.stringify(GeoTagStorageObject.getAllGeoTags())
    })
});

/*
router.post('/tagging', function (req, res, next) {
    //todo: location in storage reinschreiben
    if (req.body.lat !== '' && req.body.long !== '') {
        const newLoc = new GeoTag([req.body.name, req.body.lat, req.body.long, req.body.hashtag], GeoTagStorageObject.getAllGeoTags().length + 1)
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

router.post('/discovery', function (req, res, next) {
    const newLoc = ["temp", req.body.latHidden, req.body.longHidden, ""]
    const currentPos = new GeoTag(newLoc)

    if (req.body.keyword !== '') {
        res.render('index', {
            taglist: GeoTagStorageObject.searchNearbyGeoTags(currentPos, req.body.keyword),
            latcoord: req.body.latHidden,
            longcoord: req.body.longHidden,
            geoTagList: JSON.stringify(GeoTagStorageObject.searchNearbyGeoTags(currentPos, req.body.keyword))
        })
    } else {
        res.render('index', {
            taglist: GeoTagStorageObject.getNearbyGeoTags(currentPos),
            latcoord: req.body.latHidden,
            longcoord: req.body.longHidden,
            geoTagList: JSON.stringify(GeoTagStorageObject.getNearbyGeoTags(currentPos))
        })
    }

})
 */
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
router.get('/api/geotags', function (req, res, next) {
    const searchTerm = req.query.keyword;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const newLoc = ["temp", latitude, longitude, ""]
    const currentPos = new GeoTag(newLoc)

    if (searchTerm !== undefined && latitude !== undefined && longitude !== undefined) {
        return res.json(GeoTagStorageObject.searchNearbyGeoTags(currentPos, searchTerm));
    }

    if (longitude !== undefined && latitude !== undefined) {
        return res.json(GeoTagStorageObject.getNearbyGeoTags(currentPos))
    }

    if (searchTerm !== undefined) {
        return res.json(GeoTagStorageObject.getGeoTagsByKeyword(searchTerm))
    }

    res.json(GeoTagStorageObject.getAllGeoTags())
})

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
    //todo: maybe check for duplicates
    console.log("test")
    const prevID = GeoTagStorageObject.getAllGeoTags().length
    let hashtag = (req.body.hashtag !== undefined) ? req.body.hashtag : "";
    const array = [req.body.name, req.body.latitude, req.body.longitude, hashtag]
    const tag = new GeoTag(array, prevID + 1)
    console.log(tag)
    GeoTagStorageObject.addGeoTag(tag)
    res.header('Location', `/api/resources/${prevID}`);
    res.json(GeoTagStorageObject.getAllGeoTags()[prevID])
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
router.get('/api/geotags/:id', function (req, res, next) {
    const tag = GeoTagStorageObject.getTagByID(req.params.id)
    res.json(tag)
})

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
router.put('/api/geotags/:id', function (req, res, next) {
    const id = req.params.id
    const tag = GeoTagStorageObject.getTagByID(id)

    GeoTagStorageObject.removeGeoTag(tag.name)

    const newTag = new GeoTag([req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag], id)

    GeoTagStorageObject.addGeoTag(newTag)
    res.json(newTag)
})

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
router.delete('/api/geotags/:id', function (req, res, next) {
    const id = req.params.id
    const tag = GeoTagStorageObject.getTagByID(id)
    GeoTagStorageObject.removeGeoTag(tag.name)
    res.json(tag)
})

module.exports = router;
