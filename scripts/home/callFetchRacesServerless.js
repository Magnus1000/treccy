// Log the initiation of the script
console.log("Fetch and Load Results Script");

// Function to find approximate address based on IP address
async function getUserLocation() {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  const { latitude, longitude } = data;
  return { lat: latitude, lng: longitude };
}

let lat; // Declare global variable for latitude (to be set in CheckURLParams function)
let lng; // Declare global variable for longitude (to be set in CheckURLParams function)

// Function to check URL parameters for filters
async function checkURLParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  lat = parseFloat(urlSearchParams.get('lat'));
  lng = parseFloat(urlSearchParams.get('lng'));
  const radius = parseFloat(urlSearchParams.get('radius'));
  const filters = [];
  const sports = urlSearchParams.getAll('sport');
  if (sports.length > 0) {
    filters.push(`sport:(${sports.join(' OR ')})`);
  }
  if (!isNaN(lat) && !isNaN(lng)) {
    console.log(`Using lat:${lat} and lng:${lng} from URL params`);
    filters.push(`lat:${lat}`, `lng:${lng}`);
    if (!isNaN(radius)) {
      filters.push(`radius:${radius}`);
    }
  } else {
    const localStorageUserLocation = JSON.parse(localStorage.getItem('localStorageUserLocation'));
    if (localStorageUserLocation && localStorageUserLocation.length === 2) {
      console.log(`Using lat:${localStorageUserLocation[0]} and lng:${localStorageUserLocation[1]} from localStorage`);
      filters.push(`lat:${localStorageUserLocation[0]}`, `lng:${localStorageUserLocation[1]}`);
      if (!isNaN(radius)) {
        filters.push(`radius:${radius}`);
      }
    } else {
      const userLocation = await getUserLocation();
      console.log(`Using lat:${userLocation.lat} and lng:${userLocation.lng} from IP address`);
      filters.push(`lat:${userLocation.lat}`, `lng:${userLocation.lng}`);
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

  lat = parseFloat(lat);
  lng = parseFloat(lng);

  console.log("Filters:", filters);
  console.log(`Setting global lat and lng variables... (${lat},${lng})`);
  return filters;
}

// Function to fetch races races from Vercel function
async function fetchRacesFromVercel(filters) {
  const apiUrl = 'https://treccy-serverside-magnus1000.vercel.app/api/fetchRaces';
  try {
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
        raceResultsJSON = results; // Assign results to global variable
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
async function removeGreyedOutFromElementAndChildren(element) {
  // Remove the 'greyed-out' class from the parent element
  element.classList.remove('greyed-out');
  
  // Get all child elements with the 'greyed-out' class
  const greyedOutChildren = element.querySelectorAll('.greyed-out');
  
  greyedOutChildren.forEach(child => {
    // Remove the 'greyed-out' class from each child element
    child.classList.remove('greyed-out');
    console.log("Removing greyed-out state from element and child elements...");
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

document.addEventListener("DOMContentLoaded", async function() {
  const filters = await checkURLParams();
  fetchRacesFromVercel(filters);
});