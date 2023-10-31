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

// This function creates a marker on the map for a given result
async function createMarkerOnMap(map, result) {
  if (!Array.isArray(result.sports_search_ag)) {
    return; // Skip the result if sports_search_ag is not a valid array
  }
  // Create a new div element for the marker icon instead of image
  const markerIcon = document.createElement('div');
  markerIcon.className = 'markerIconClass';
  markerIcon.style.backgroundImage = `url(${getMarkerIcon(result.sports_search_ag)})`; // Set the background image of the marker icon
  if (result.sports_search_ag.length > 1) {
      // If there are multiple sports, create a new div element for the race count
      const raceCount = document.createElement('div');
      raceCount.className = 'race-count';
      raceCount.innerHTML = `+${result.sports_search_ag.length - 1}`; // Display the additional sports count
      markerIcon.appendChild(raceCount); // Add the race count div as a child of the marker icon
  }
  const popupHTML = await cloneAndPopulateDiv(result); // Clone and populate the div for the popup
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML); // Create a new popup with the cloned and populated div
  const marker = new mapboxgl.Marker({ element: markerIcon, anchor: 'bottom' }) // Create a new marker with the marker icon as the element and the bottom as the anchor
      .setLngLat([result._geoloc.lng, result._geoloc.lat]) // Set the longitude and latitude of the marker
      .setPopup(popup) // Set the popup for the marker
      .addTo(map); // Add the marker to the map
  currentMarkers.push(marker); // Add the marker to the current markers array
}

async function cloneAndPopulateDiv(result) {
  // Clone the original div by its ID "map-pop-up"
  const clonedDiv = document.getElementById('map-pop-up').cloneNode(true);

  // Remove the ID from the cloned div
  clonedDiv.removeAttribute('id');

  // Populate elements within the cloned div
  const sportElement = clonedDiv.querySelector('.map-popup-sport');
  if (sportElement) {
    sportElement.innerText = result.sports_display_ag || '';
  }

  const imageElement = clonedDiv.querySelector('.map-popup-image');
  if (imageElement) {
    imageElement.src = result.photo_main_ag || '';
  }

  const headerElement = clonedDiv.querySelector('.map-popup-header');
  if (headerElement) {
    headerElement.innerText = result.name_ag || '';
  }

  const cityElement = clonedDiv.querySelector('.map-popup-city-text');
  if (cityElement) {
    cityElement.innerText = result.city_ag || '';
  }

  const regionElement = clonedDiv.querySelector('.map-popup-region-text');
  if (regionElement) {
    regionElement.innerText = result.region_ag || '';
  }

  const dateElement = clonedDiv.querySelector('.map-popup-date-text');
  if (dateElement) {
    dateElement.innerText = formatDate(result.date_ag) || '';
  }

  const distancesElement = clonedDiv.querySelector('.map-popup-distances');
  if (distancesElement) {
    distancesElement.innerText = result.distances_display_ag || '';
  }

  const linkBlockElement = clonedDiv.querySelector('.map-popup-link-block');
  if (linkBlockElement) {
    linkBlockElement.href = `/race/${result.slug_ag}` || '';
  }

  console.log('clonedDiv.outerHTML:', clonedDiv.outerHTML); // Debugging line
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
      // Fetch access token and map style from serverless function
      const response = await fetch('https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/initializeMapBox.js');
      const { accessToken, mapStyle } = await response.json();

      // Define the map using the mapboxgl.Map constructor
      map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        center: [lng, lat],
        zoom: 10,
        accessToken: accessToken
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
    hideMapPopUp(); // Hide the div with ID "map-pop-up"
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
    'Canoeing': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc7dba62b783c281c45a_canoe-circle-icon.svg',
    'Cycling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc44e2b9829d54199d60_cycling-circle-icon.svg',
    'Cyclocross': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Duathlon': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf466b62af154c47bd51b_duathlon-white.svg',
    'E-Biking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc96c1c6eddc4593ff6e_ebike-circle-icon.svg',
    'Gravel Biking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf521e3e8f97337dfa5b5_person-biking-mountain-solid-white.svg',
    'Kayaking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc4cf714a6608d30c8d4_kayak-circle-icon.svg',
    'Mountain Biking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc741344fe92a5ede6bf_mountain-bike-circle-icon.svg',
    'Multisport': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536b66edbb5a07fd9587042_multisport-circle-icon.svg',
    'Nordic': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Obstacle': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Orienteering': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Outrigger': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bcafa452cf3f7772d41d_outrigger-circle-icon.svg',
    'Rowing': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc38723acf5c43ee8908_running-circle-icon.svg',
    'Running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/652bf4d0fd19962a330ec0f9_person-running-solid-white.svg',
    'Stand Up Paddling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bca80e4526f0869b676d_paddle-boarding-circle-icon.svg',
    'Surfski': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg',
    'Swimming': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc61b3373036c9dd6325_swimming-circle-icon.svg',
    'Trail Running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536b6bbc8b75bcb180b2dbb_trailrunning-circle-icon.svg',
    'Triathlon': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536b69668e3ae76ff963f8d_triathlon-circle-icon.svg',
    'Walking': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed6/6536bc8d9155007524f811c6_walking-circle-icon.svg'
  };
  return sportToIconMap[sports?.[0]] || 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/6536b1433b89d8f50a64b09e_treccy-placeholder-marker.svg'; // Use the first sport to get the icon URL
}

// Function to hide the div with ID "map-pop-up"
function hideMapPopUp() {
  // Find the div with ID "map-pop-up"
  const mapPopUpElement = document.getElementById('map-pop-up');
  
  // Check if the element exists
  if (mapPopUpElement) {
    // Set the display to 'none' to hide it
    mapPopUpElement.style.display = 'none';
    
    // Log a message to the console
    console.log('Successfully hid the div with ID "map-pop-up".');
  } else {
    // Log a message if the element couldn't be found
    console.log('Could not find a div with ID "map-pop-up".');
  }
}

