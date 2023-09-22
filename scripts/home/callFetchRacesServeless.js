// Log the initiation of the script
console.log("Fetch and Load Results Script");

// Function to check URL parameters for filters
function checkURLParams() {
  const urlSearchParams = new URLSearchParams(window.location.search); // Get URL parameters
  const lat = parseFloat(urlSearchParams.get('lat')); // Get latitude from URL parameters
  const lng = parseFloat(urlSearchParams.get('lng')); // Get longitude from URL parameters
  const radius = parseFloat(urlSearchParams.get('radius')); // Get radius from URL parameters

  // Create an array of filters based on the URL parameters
  const filters = [];
  const sports = urlSearchParams.getAll('sport'); // Get sports from URL parameters
  if (sports.length > 0) {
    filters.push(`sport:(${sports.join(' OR ')})`);
  }
  if (!isNaN(lat) && !isNaN(lng)) { // Check if lat and lng are valid numbers
    filters.push(`lat:${lat}`, `lng:${lng}`); // Add lat and lng to filters array
    if (!isNaN(radius)) { 
      filters.push(`radius:${radius}`);
    }
  } else { // If lat and lng are not valid numbers, check if user location is available in local storage
    const localStorageUserLocation = JSON.parse(localStorage.getItem('localStorageUserLocation')); // Get user location from local storage
    if (localStorageUserLocation && localStorageUserLocation.length === 2) { // Check if user location is available in local storage
      filters.push(`lat:${localStorageUserLocation[0]}`, `lng:${localStorageUserLocation[1]}`); // Add lat and lng to filters array from local storage
      if (!isNaN(radius)) {
        filters.push(`radius:${radius}`);
      }
    }
  }
  const minDist = parseInt(urlSearchParams.get('minDist'));
  if (minDist !== null) {
    filters.push(`distance >= ${minDist}`);
  }
  const maxDist = parseInt(urlSearchParams.get('maxDist'));
  if (maxDist !== null) {
    filters.push(`distance <= ${maxDist}`);
  }
  const fromDate = urlSearchParams.get('fromDate');
  if (fromDate !== null) {
    filters.push(`date >= ${fromDate}`);
  }
  const toDate = urlSearchParams.get('toDate');
  if (toDate !== null) {
    filters.push(`date <= ${toDate}`);
  }

  console.log("Filters:", filters);
}

// Function to fetch races races from Vercel function
async function fetchRacesFromVercel() {
  const apiUrl = 'https://treccy-serverside-magnus1000.vercel.app/api/fetchRaces';
  try {
    const filters = checkURLParams(); // Call checkURLParams function to get filters array
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filters }), // Pass filters array as JSON
    });

    if (response.ok) {
        const results = await response.json();
        console.log('Results fetched from Vercel function:', results);
        populateRaceCards(results);
        hideUnusedRaceCards(); // Hide unused race cards after populating
      } else {
        console.log('No saved races found via Vercel function.');
        hideUnusedRaceCards(); // Hide all race cards if no results found
      }
    } catch (error) {
      console.error('An error occurred while fetching races from Vercel function:', error);
      hideUnusedRaceCards(); // Hide all race cards if an error occurs
    }
  }

// Function to remove greyed-out state from the parent and its children
function removeGreyedOutFromElementAndChildren(element) {
  console.log("Removing greyed-out state from element and child elements...");
  
  // Remove the 'greyed-out' class from the parent element
  element.classList.remove('greyed-out');
  
  // Get all child elements with the 'greyed-out' class
  const greyedOutChildren = element.querySelectorAll('.greyed-out');
  
  greyedOutChildren.forEach(child => {
    // Remove the 'greyed-out' class from each child element
    child.classList.remove('greyed-out');
  });
}

// Function to create a race card
function createRaceCard() {
  const raceCardTemplate = document.getElementById("race-card");
  const newRaceCard = raceCardTemplate.cloneNode(true);
  newRaceCard.removeAttribute('id');
  newRaceCard.style.display = 'flex';
  return newRaceCard;
}

// Function to hide unused race cards
function hideUnusedRaceCards() {
  console.log("Hiding unused race cards...");
  
  const existingRaceCards = document.querySelectorAll('.race-card-component');
  existingRaceCards.forEach(raceCard => {
    if (raceCard.classList.contains('greyed-out')) {
      raceCard.classList.add('hidden');
    }
  });
}

// Function to populate race cards
function populateRaceCards(results) {
  console.log("Populating Race Cards...");
  const algoliaRacesDiv = document.getElementById('algoliaRaces'); // Assuming all your race cards are inside this div

  const existingRaceCards = Array.from(algoliaRacesDiv.querySelectorAll('.race-card')); // Assuming all your race cards have a common class named 'race-card-class'

  results.forEach((result, index) => {
    if (existingRaceCards[index]) { // Check to ensure an existing card is available to populate
      const raceCardToPopulate = existingRaceCards[index];
      removeGreyedOutFromElementAndChildren(raceCardToPopulate);

      const formattedDate = formatDate(result.date_ag);
      const formattedDistance = formatDistances(result.distances_ag);
      const formattedSports = formatSports(result.sports_ag);
      raceCardToPopulate.querySelector('.race-card-top-block').href = `/race/${result.slug_ag}`;
      raceCardToPopulate.querySelector('.race-card-image').src = result.photo_main_ag;
      raceCardToPopulate.querySelector('.race-card-image').alt = result.name_ag;
      raceCardToPopulate.querySelector('.card-text-link-block').href = `/race/${result.slug_ag}`;
      raceCardToPopulate.querySelector('.race-card-heading').textContent = result.name_ag;
      raceCardToPopulate.querySelector('.race-card-minimum-distance').textContent = formattedDistance;
      raceCardToPopulate.querySelector('.race-city-text').textContent = result.city_ag;
      raceCardToPopulate.querySelector('.race-country-text').textContent = result.country_ag;
      raceCardToPopulate.querySelector('.race-sport-text').textContent = formattedSports;
      raceCardToPopulate.querySelector('.race-card-date-text').textContent = formattedDate;
      raceCardToPopulate.querySelector('.like-button-div .like-button').setAttribute('data-object-id', result.objectID);
    }
  }); 
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  fetchRacesFromVercel();
});

/*

// Trigger the entire process
fetchLikes();

// Call initLikeButtons here, after new content has been added
console.log("New cards populated. Re-initializing like-buttons.");
initLikeButtons();

*/






/*// Function to populate race cards
function populateRaceCards(results) {
  console.log("Populating Race Cards...");

  const algoliaRacesDiv = document.getElementById('algoliaRaces');

  results.forEach(result => {
    console.log("result.slug_ag:", result.slug_ag);
    const raceCardTemplate = document.getElementById("race-card");
    const newRaceCard = raceCardTemplate.cloneNode(true);
    newRaceCard.removeAttribute('id');
    newRaceCard.style.display = 'flex';

    const formattedDate = formatDate(result.date_ag); 
    newRaceCard.querySelector('.race-card-top-block').href = `/race/${result.slug_ag}`;
    newRaceCard.querySelector('.race-card-image').src = result.photo_main_ag;
    newRaceCard.querySelector('.race-card-image').alt = result.name_ag;
    newRaceCard.querySelector('.card-text-link-block').href = `/races/${result.slug_ag}`;
    newRaceCard.querySelector('.race-card-heading').textContent = result.name_ag;
    newRaceCard.querySelector('.race-card-heading-right').textContent = result.distances_ag;
    newRaceCard.querySelector('.race-city-text').textContent = result.city_ag;
    newRaceCard.querySelector('.race-country-text').textContent = result.country_ag; 
    newRaceCard.querySelector('.race-card-date-text').textContent = formattedDate;
    // Add this line within the loop to set the data-object-id attribute
    newRaceCard.querySelector('.like-button-div .like-button').setAttribute('data-object-id', result.objectID);

    algoliaRacesDiv.appendChild(newRaceCard);
  });

  // Call initLikeButtons here, after new content has been added
  console.log("New cards populated. Re-initializing like-buttons.");
  initLikeButtons();
}

// Date formatting function
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().substr(-2);
  const formattedDate = `${day} ${month} ${year}`;
  console.log("Formatted date:", formattedDate);
  return formattedDate;
}*/

/*// Asynchronous function to fetch Algolia Results
async function fetchAlgoliaResults(lat, lng, radius, page = 0) {
  console.log("Fetching Algolia Results...");

  const urlSearchParams = new URLSearchParams(window.location.search);
  const filters = [];

  // Check if fromDate and toDate are set in the global scope
  let fromDate = window.fromDate;
  let toDate = window.toDate;

  // If not set, default to today and today + 60 days
  if (!fromDate || !toDate) {
    const today = new Date();
    const sixtyDaysLater = new Date(today);
    sixtyDaysLater.setDate(today.getDate() + 60);

    fromDate = today.getTime();
    toDate = sixtyDaysLater.getTime();
  }

  // Add date filters for Algolia
  filters.push(`date_ag >= ${fromDate} AND date_ag <= ${toDate}`);

  let minDist = null;
  let maxDist = null;

  // Iterate through all parameters and build the filters dynamically
  urlSearchParams.forEach((value, key) => {
      if (key === 'view' || value === '' || value === 'NaN') {
          // Ignore the "view" parameter and any empty or 'NaN' values
          return;
      }
      if (key.startsWith('discipline')) {
          filters.push(`disciplines_ag:${value}`);
      } else if (key === 'minDist') {
          minDist = value;
      } else if (key === 'maxDist') {
          maxDist = value;
      } else if (key !== 'lat' && key !== 'lng' && key !== 'locationRange') {
          filters.push(`${key}:${value}`);
      }
  });

  if (minDist && maxDist) {
      filters.push(`distances_ag:${minDist} TO ${maxDist}`);
  } else if (minDist) {
      filters.push(`distances_ag >= ${minDist}`);
  } else if (maxDist) {
      filters.push(`distances_ag <= ${maxDist}`);
  }
  // Prepare search parameters
  const searchParams = {
      hitsPerPage: 20,
      filters: filters.join(' AND '),
      page: page
  };

  // Include aroundLatLng and aroundRadius if lat and lng are valid numbers
  if (!isNaN(lat) && !isNaN(lng)) {
      searchParams.aroundLatLng = `${lat},${lng}`;
      if (!isNaN(radius)) {
          searchParams.aroundRadius = radius;
      }
  }

  const searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
  const index = searchClient.initIndex(algoliaConfig.indexName);

  console.log("Filters being sent to Algolia:", filters);

  // URL encode the filters before building the debug URL
  const encodedFilters = encodeURIComponent(filters.join(' AND '));
  const debugURL = `https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes/${algoliaConfig.indexName}/query?hitsPerPage=20&aroundLatLng=${lat},${lng}&aroundRadius=${radius}&filters=${encodedFilters}`;
  console.log("Debug URL with parameters:", debugURL);

  try {
      const results = await index.search('', searchParams);
      console.log("Algolia Search Results:", results);

      // Update the global algoliaResults variable with the fetched results
      algoliaResults = results.hits;

      return results.hits;
  } catch (error) {
      console.error("An error occurred while fetching Algolia results:", error);
      return [];
  }
}*/

/*// Asynchronous function to load Algolia Results into a HTML Div
async function loadAlgoliaResultsToDiv(lat, lng, radius, page = 0) {
  const results = await fetchAlgoliaResults(lat, lng, radius, page);
  if (results.length > 0) {
    populateRaceCards(results);
  } else {
    console.log("No results found.");
    // Optionally, insert a "No results found" message into the HTML here
  }
}*/
