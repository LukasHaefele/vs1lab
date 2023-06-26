// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    // TODO: ... your code here ...
    //['Castle', 49.013790, 8.404435, '#sight'],
    constructor(geotag, id) {
        this.id = id
        this.name = geotag[0]
        this.latitude = geotag[1]
        this.longitude = geotag[2]
        this.hashtag = geotag[3]
    }
    
}

module.exports = GeoTag;