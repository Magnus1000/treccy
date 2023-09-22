<!-- Mapbox styles and scripts -->
<link href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet' />
<script src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js'></script>
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css" type="text/css" />
<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>

const currentMarkers = []; // Define the currentMarkers array

async function createMarkerOnMap(map, result) {
  // Create an image element for the marker icon
  const markerIcon = new Image(50, 50);
  markerIcon.src = result.photo_main_ag;

  // Clone and populate the div
  const popupHTML = await cloneAndPopulateDiv(result); // Wait for the Promise to resolve

  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML);

  const marker = new mapboxgl.Marker({ element: markerIcon, anchor: 'bottom' })
    .setLngLat([result._geoloc.lng, result._geoloc.lat])
    .setPopup(popup)
    .addTo(map);

  currentMarkers.push(marker);
}

// New function to clone and populate the div
async function cloneAndPopulateDiv(result) {
  // Clone the original div by its ID "map-pop-up"
  const clonedDiv = document.getElementById('map-pop-up').cloneNode(true);

  // Populate elements within the cloned div
  clonedDiv.querySelector('.map-popup-sport').innerText = result.sports_ag.join(', ');
  clonedDiv.querySelector('.map-popup-image').src = result.photo_main_ag;
  clonedDiv.querySelector('.map-popup-link-block').href = `/race/${result.slug_ag}`;
  clonedDiv.querySelector('.map-popup-header').innerText = result.name_ag;
  clonedDiv.querySelector('.map-popup-city-text').innerText = result.city_ag;
  clonedDiv.querySelector('.map-popup-country-text').innerText = result.country_ag;
  clonedDiv.querySelector('.map-popup-date-text').innerText = formatDate(result.date_ag);

  return clonedDiv.outerHTML; // Returns the HTML content of the cloned and populated div
}

async function displayMapWithResults(lat, lng) {
  try {
    console.log("Displaying Map with Results...");

    // Check if lat and lng are NaN, set to Vancouver if they are
    if (isNaN(lat)) {
      lat = 49.2827;
    }
    if (isNaN(lng)) {
      lng = -123.1207;
    }

    // Define the map using the mapboxgl.Map constructor
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
      center: [lng, lat],
      zoom: 10,
      accessToken: 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ'
    });

    // Add controls to the map
    map.addControl(new mapboxgl.NavigationControl());

    // Use global race results variable
    const results = raceResultsJSON; 
    console.log("Using results for map:", results); // Additional logging for debugging

    // Loop through race results and add new markers
    results.forEach(result => {
      createMarkerOnMap(map, result);
    });

    // Resize map to fit new markers
    map.resize();
  } catch (error) {
    // Log any errors that occur
    console.error("Error displaying map with results:", error);
  }
}

// Function to attach event listeners to the "Show Map" button
document.getElementById('showMap').addEventListener('click', async function() {
    await toggleView(true);
});

// Function to attach event listeners to the "Show List" button
document.getElementById('showList').addEventListener('click', async function() {
    await toggleView(false);
});

// Function to hide and show map and list views
async function toggleView(showMap) {
    console.log(showMap ? "Show Map Button Clicked..." : "Show List Button Clicked...");
    document.getElementById('map-div-wrapper').style.display = showMap ? 'flex' : 'none';
    document.getElementById('showListrow').style.display = showMap ? 'flex' : 'none';
    document.getElementById('showMaprow').style.display = showMap ? 'none' : 'flex';
    document.getElementById('algoliaRaces').style.display = showMap ? 'none' : 'grid';

    if (showMap) {
        displayMapWithResults(lat, lng); // Passing in global variables for lat and lng
    }
}