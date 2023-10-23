const currentMarkers = []; // Define the currentMarkers array

// Function to add or remove "map-view" class
function manageMapViewClass(showMap) {
  // Find the div with class "map-and-list-wrapper"
  const wrapperDiv = document.querySelector('.map-and-list-wrapper');

  if (showMap) {
    // Add "map-view" class
    wrapperDiv.classList.add('map-view');
  } else {
    // Remove "map-view" class
    wrapperDiv.classList.remove('map-view');
  }
}

async function createMarkerOnMap(map, result) {
  // Create an image element for the marker icon
  const markerIcon = new Image(50, 50);
  markerIcon.src = getMarkerIcon(result.sports_ag);

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

let map; // Define a global variable to store the map instance

async function displayMapWithResults() {
  try {
    console.log("Displaying Map with Results...");

    // Get lat and lng from URL params or local storage
    const urlParams = new URLSearchParams(window.location.search);
    let lat = parseFloat(urlParams.get('lat'));
    let lng = parseFloat(urlParams.get('lng'));
    if (isNaN(lat) || isNaN(lng)) {
      const userLocationArray = JSON.parse(localStorage.getItem('userLocation'));
      if (userLocationArray && userLocationArray.length >= 2) {
        lat = parseFloat(userLocationArray[0]);
        lng = parseFloat(userLocationArray[1]);
      }
    }
    if (isNaN(lat) || isNaN(lng)) {
      lat = 40.01499;
      lng = -105.27055;
    }

    // Check if map instance already exists
    if (!map) {
      // Define the map using the mapboxgl.Map constructor
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
        center: [lng, lat],
        zoom: 10,
        accessToken: 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ'
      });

      // Add controls to the map
      map.addControl(new mapboxgl.NavigationControl());
    }

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
    document.getElementById('race-grid-container').style.display = showMap ? 'none' : 'grid';
    
    // Add or remove "map-view" class
      manageMapViewClass(showMap);

    if (showMap) {
        displayMapWithResults(lat, lng); // Passing in global variables for lat and lng
    }
}

// Function to get the marker icon based on the sports_ag value
function getMarkerIcon(sports) {
  let markerIconSrc = '';
  const sportToIconMap = {
    'Aquabike': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Aquathlon': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Canoeing': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf441b62af154c47bb29b_canoe-icon-white.svg',
    'Cycling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf530f9121f403b35cfc2_person-biking-solid-white.svg',
    'Cyclocross': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Duathlon': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf466b62af154c47bd51b_duathlon-white.svg',
    'E-Biking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf47eb62af154c47bfba2_solid-person-biking-circle-bolt-white.svg',
    'Gravel Biking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf521e3e8f97337dfa5b5_person-biking-mountain-solid-white.svg',
    'Kayaking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf48be3e8f97337dee5db_kayak-svg-white.svg',
    'Mountain Biking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf49a722f7ce55d05ace9_person-biking-mountain-solid-white-1.svg',
    'Multisport': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf431b05ba5609db9c810_multisport-white.svg',
    'Nordic': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Obstacle': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Orienteering': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Outrigger': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4aab4f9def31a6bb7e6_outrigger-icon-white.svg',
    'Rowing': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4c2ac2fb6a71adc1921_rowing-icon-white.svg',
    'Running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4d0fd19962a330ec0f9_person-running-solid-white.svg',
    'Stand Up Paddling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4d7722f7ce55d05dc6e_paddleboard-white.svg',
    'Surfski': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Swimming': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4e119f4ee801a5a891f_person-swimming-solid-white.svg',
    'Trail Running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4ec15486531fd1a3bdc_trail-running-white.svg',
    'Triathlon': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4f6321d770f2238dc27_triathlon-white.svg',
    'Walking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf50bb62af154c47ca612_person-walking-solid-white.svg'
  };

  sports.forEach(sport => {
    if (sportToIconMap[sport]) {
      markerIconSrc = sportToIconMap[sport];
    }
  });

  return markerIconSrc;
}