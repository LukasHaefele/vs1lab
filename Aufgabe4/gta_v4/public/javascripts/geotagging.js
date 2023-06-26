// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */


// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
//########## findLocation wird nur noch aufgerufen, wenn lat und long felder '' sind

var globarlTagArray = []

async function init() {
    globarlTagArray = await fetch("api/geotags", {
        method: "GET"
    }).then(response => response.json())
    updateListing(globarlTagArray);
    updateLocation();

}


function updateLocation() {
    //Todo: call LocationHelper.findLocation only when coord doesn't exist yet
    const lat = document.getElementById("lat").value
    const long = document.getElementById("long").value
    if (lat !== '' && long !== '') {
        mapUpdate(lat, long)
    } else {
        LocationHelper.findLocation((helper) => {
            document.getElementById("lat").value = helper.latitude
            document.getElementById("long").value = helper.longitude
            document.getElementById("latHidden").value = helper.latitude
            document.getElementById("longHidden").value = helper.longitude
            mapUpdate(helper.latitude, helper.longitude)
        })
    }
}

function mapUpdate(lat, long) {
    const mapManager = new MapManager('Ikx9sjyYJtIj09QQ4NPE7j8NVIjyFY0F')

    const tags = JSON.parse(document.getElementById('mapView').dataset.tags)
    const mapUrl = mapManager.getMapUrl(lat, long, tags, 13)
    const mapView = document.getElementById("mapView")
    mapView.src = mapUrl

}

function apiMapUpdate() {
    const mapManager = new MapManager('Ikx9sjyYJtIj09QQ4NPE7j8NVIjyFY0F')
    const lat = document.getElementById("lat").value
    const long = document.getElementById("long").value
    const mapUrl = mapManager.getMapUrl(lat, long, globarlTagArray, 13)
    const mapView = document.getElementById("mapView")
    mapView.src = mapUrl

}

document.getElementById("tag-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    let geotag = {
        name: document.getElementById("name").value,
        latitude: document.getElementById("lat").value,
        longitude: document.getElementById("long").value,
        hashtag: document.getElementById("hashtag").value
    };
    postAdd(geotag)
        .then(apiMapUpdate)
    globarlTagArray.push(geotag);
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";
    document.getElementById("searchterm").value = "";

    //window.location.reload();
    updateListing(globarlTagArray);
}, true)

async function postAdd(geoTag) {
    let response = await fetch("api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geoTag)
    });
    return response.json()
}

document.getElementById("discoveryButton").addEventListener("click", async (e) => {
    e.preventDefault();
    const formInput = document.getElementById("searchterm").value;
    const lat = document.getElementById("latHidden").value
    const long = document.getElementById("longHidden").value
    let url = `api/geotags?latitude=${lat}&longitude=${long}`;
    if (formInput.length !== 0) {
        url = url + `&keyword=${formInput}`
        url = url.replace("#", "%23")
    }
    const result = await fetch(url).then(response => response.json())
    updateListing(result)
    apiMapUpdate()
})

function updateListing(list) {
    document.getElementById("discoveryResults").innerHTML = "";
    if (list !== undefined) {
        globarlTagArray = list
    }
    for (let i = 0; i < globarlTagArray.length; i++) {
        const tag = globarlTagArray[i];
        const newLI = document.createElement("li")
        newLI.innerHTML += '' + tag.name + " (" + tag.latitude + "," + tag.longitude + ") " + tag.hashtag + '';
        document.getElementById('discoveryResults').appendChild(newLI);
    }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", init, true);