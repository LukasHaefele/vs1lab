// File origin: VS1LAB A3
const GeoTagExamples = require("./geotag-examples")
const GeoTag = require("./geotag")

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store. [x]
 *
 * Provide a method 'addGeoTag' to add a geotag to the store. [x]
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name. [x]
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {

    // TODO: ... your code here ...
    #geoTags = []
    #proximity = 5 // distance in km

    constructor() {
        const examples = GeoTagExamples.tagList
        examples.forEach((geotag) => {
            this.#geoTags.push(new GeoTag(geotag, this.#geoTags.length + 1));
        })
    }

    getAllGeoTags() {
        return this.#geoTags
    }

    addGeoTag(geoTag) {
        this.#geoTags.push(geoTag)
    }

    removeGeoTag(tagName) {
        this.#geoTags = this.#geoTags.filter(element => element.name !== tagName)
    }

    getNearbyGeoTags(location) {
        return this.#geoTags.filter(element => this.#distance(location, element) < this.#proximity)
    }

    getTagByID(id) {
        for (const geoTag of this.#geoTags) {
            if (geoTag.id === parseInt(id)) return geoTag
        }
    }

    searchNearbyGeoTags(location, keyword) {

        const filteredByDistance = this.getNearbyGeoTags(location)
        return filteredByDistance.filter(element => (element.hashtag === keyword || element.name === keyword))
    }

    getGeoTagsByKeyword(keyword) {
        return this.#geoTags.filter(element => (element.hashtag === keyword || element.name === keyword))
    }

    #distance(loc1, loc2) {
        const radius = 6371 // Earth radius in km
        const deltaLat = this.#toRadians(loc2.latitude - loc1.latitude)
        const deltaLong = this.#toRadians(loc2.longitude - loc1.longitude)

        const a = Math.sin(deltaLat / 2) ** 2 +
            Math.cos(this.#toRadians(loc1.latitude)) * Math.cos(this.#toRadians(loc2.latitude)) * Math.sin(deltaLong / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // returns distance in km
        return radius * c
    }

    #toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = InMemoryGeoTagStore