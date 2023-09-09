<!-- Mapbox styles and scripts -->
<link href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet' />
<script src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js'></script>
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css" type="text/css" />
<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>


<script>
const mapboxToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';

const disciplineMarkers = {
    'swimming': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833f1995f2e23c39eacc_swimming-icon-50.svg',
    'paddling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d28340c9aa33055043be71_paddling-icon-50.svg',
    'running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833f7badb96d1c86df8b_running-icon-50.svg',
    'cycling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833fff1d33088ebee8f4_cycling-icon-50.svg',
    'default': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64ce497c38241ed462982298_favicon32.jpg'
};

const defaultLat = -45.0312; // Default latitude for Queenstown
const defaultLng = 168.6626; // Default longitude for Queenstown

// Function to get coordinates from URL or use default
function getCoordinatesFromUrl() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlSearchParams.get('lat'));
    const lng = parseFloat(urlSearchParams.get('lng'));

    // If lat and lng are not available or are NaN, use the default coordinates
    if (isNaN(lat) || isNaN(lng)) {
        return {
            lat: defaultLat, // Default latitude
            lng: defaultLng // Default longitude
        };
    }

    return {
        lat: lat,
        lng: lng
    };
}

function updateViewInUrl(viewType) {
  const url = new URL(window.location.href);
  url.searchParams.set('view', viewType);
  history.replaceState(null, null, url.toString());
  console.log(`URL updated with view: ${viewType}`);
}

document.getElementById('showMap').addEventListener('click', async function() {
    await toggleView(true);
    updateViewInUrl('map');
});

document.getElementById('showList').addEventListener('click', async function() {
    if (map) saveMapState(map); // Save the map state if the map instance exists
    await toggleView(false);
    updateViewInUrl('list');
});

let mapState = {
    zoom: 10,
    center: [defaultLng, defaultLat]
};

let map; // Declare map variable without initializing it here

function saveMapState(map) {
    mapState.zoom = map.getZoom();
    mapState.center = map.getCenter().toArray();
    console.log("Map state saved:", mapState);
}

function restoreMapState(map) {
    console.log(map); // Inspect the map object
    map.setZoom(mapState.zoom);
    map.setCenter(mapState.center);
    console.log("Map state restored:", mapState);
}

async function toggleView(showMap) {
    console.log(showMap ? "Show Map Button Clicked..." : "Show List Button Clicked...");
    document.getElementById('map').style.display = showMap ? 'flex' : 'none';
    document.getElementById('showListrow').style.display = showMap ? 'flex' : 'none';
    document.getElementById('showMaprow').style.display = showMap ? 'none' : 'flex';
    document.getElementById('algoliaRaces').style.display = showMap ? 'none' : 'grid';

    if (showMap) {
        const coordinates = getCoordinatesFromUrl();
        displayMapWithResults(coordinates.lat, coordinates.lng);
    }
}

function getMarkerImageUrl(disciplines) {
    if (disciplines.length === 1) {
        const disciplineKey = disciplines[0].toLowerCase();
        return disciplineMarkers[disciplineKey] || disciplineMarkers['default'];
    }
    return disciplineMarkers['default'];
}

let currentMarkers = []; // Assuming this is previously declared

function removeExistingMarkers() {
    for (const marker of currentMarkers) {
        marker.remove();
    }
    currentMarkers = [];
}

function createMarkerOnMap(map, result) {
    const markerImageUrl = getMarkerImageUrl(result.disciplines_ag);
    const customMarker = new Image(50, 50);
    customMarker.src = markerImageUrl;

    // Creating the disciplines div
    let disciplinesDiv = '';
    result.disciplines_ag.forEach(discipline => {
        disciplinesDiv += `<div class="map-popup-discipline">${discipline}</div>`;
    });

    // Formatted date
    const formattedDate = formatDate(result.date_ag);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="map-popup-div">
            <div class="map-popup-image-div">
                <a href="/races/${result.slug_ag}" class="map-popup-link-block w-inline-block">
                    <img src="${result.photo_main_ag}" loading="lazy" alt="" class="map-popup-image">
                </a>
                <div class="map-popup-discipline-div">${disciplinesDiv}</div>
                <div class="heart-icon-div"><div class="heart-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
  <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
</svg></div>
                </div>
            </div>
            <a href="/races/${result.slug_ag}" class="link-block w-inline-block">
                <div class="map-popup-header-div">
                    <div class="map-popup-header">${result.name_ag}</div>
                </div>
                <div class="map-popup-country-and-date-div">
                    <div class="map-popup-header-country-div">
                        <div class="map-popup-city-text">${result.city_ag}</div>
                        <div class="map-popup-comma">, </div>
                        <div class="map-popup-country-text">${result.country_ag}</div>
                    </div>
                    <div class="map-popup-date-div">
                        <div class="map-popup-date-text">${formattedDate}</div>
                    </div>
                </div>
            </a>
        </div>
    `);

    const marker = new mapboxgl.Marker(customMarker)
        .setLngLat([result._geoloc.lng, result._geoloc.lat])
        .setPopup(popup)
        .addTo(map);

    currentMarkers.push(marker); // Add the marker to the currentMarkers array
}

async function displayMapWithResults(lat, lng) {
    console.log("Displaying Map with Results...");

    if (!map) { // Only create a new map instance if it doesn't exist
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
            center: [lng, lat],
            zoom: 10,
            accessToken: mapboxToken
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

    } else {
        restoreMapState(map); // Restore the map state if map instance already exists
    }
    
    // Log the Algolia results to verify they are as expected
    console.log("Algolia Results:", algoliaResults);

    // Clear any existing markers
    removeExistingMarkers();

    // Use the global Algolia results variable instead of fetching
    const results = algoliaResults;
    console.log("Using results for map:", results); // Additional logging

    results.forEach(result => {
        createMarkerOnMap(map, result);
    });

    map.resize();
}

function initializeCheckboxStyling() {
    console.log("Adjusting Checkbox Styling...");

    function updateCheckboxStyling() {
        const spanElement = this.nextElementSibling;
        const parentLabel = spanElement.closest(".w-checkbox.checkbox-buttons");
        if (this.checked) {
            parentLabel.classList.add("active-filter");
        } else {
            parentLabel.classList.remove("active-filter");
        }
    }

    const checkboxes = document.querySelectorAll(".w-checkbox.checkbox-buttons input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateCheckboxStyling);
        updateCheckboxStyling.call(checkbox); // Call it initially for each checkbox
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Document Ready...");
    initializeCheckboxStyling();

});
</script>
