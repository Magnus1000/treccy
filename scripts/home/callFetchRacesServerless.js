// Log the initiation of the script
console.log("Fetch and Load Results Script");

let currentPage = 0; // Initialize current page to 0 for Algolia's zero-based pagination

let lat; // Declare global variable for latitude (to be set in CheckURLParams function)
let lng; // Declare global variable for longitude (to be set in CheckURLParams function)

async function checkURLParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sports = Array.from(urlSearchParams.keys())
    .filter(key => /^sport\d+$/.test(key))
    .map(key => urlSearchParams.get(key).replace(/-/g, ' '));
  const minDist = parseInt(urlSearchParams.get('minDist'));
  const maxDist = parseInt(urlSearchParams.get('maxDist'));
  const dateFrom = parseInt(urlSearchParams.get('fromDate'));
  const dateTo = parseInt(urlSearchParams.get('toDate'));
  const radius = parseInt(urlSearchParams.get('radius')) 
  let lat = parseFloat(urlSearchParams.get('lat'));
  let lng = parseFloat(urlSearchParams.get('lng'));

  if (isNaN(lat) || isNaN(lng)) {
      await getUserLocation();
      console.log(`Using lat:${userLocation[0]} and lng:${userLocation[1]} from getUserLocation function`);
      lat = parseFloat(userLocation[0]);
      lng = parseFloat(userLocation[1]);
      if (isNaN(lat) || isNaN(lng)) {
        console.log(`Using lat:40.014 and lng:105.270 as fourth fallback option`);
        lat = 40.014;
        lng = 105.270;
      }
    }
  }

  const filters = {};
  if (sports.length > 0) {
    filters.sports = sports;
  }
  if (!isNaN(minDist)) {
    filters.minDist = minDist;
  }
  if (!isNaN(maxDist)) {
    filters.maxDist = maxDist;
  }
  if (!isNaN(dateFrom)) {
    filters.dateFrom = dateFrom;
  }
  if (!isNaN(dateTo)) {
    filters.dateTo = dateTo;
  }
  if (!isNaN(lat) && !isNaN(lng)) {
    filters.lat = lat;
    filters.lng = lng;
    if (!isNaN(radius)) {
      filters.radius = radius;
    }
  }

  try {
    console.log("Filters:", filters); //JSON object
    console.log(`Setting global lat and lng variables... (${lat},${lng})`);
    await fetchRacesFromVercel(filters);
  } catch (error) {
    console.error(`Error fetching races: ${error}`);
  }

  updateFormFieldsFromURL();
}

// Function to fetch races races from Vercel function
async function fetchRacesFromVercel(filters) {
  const apiUrl = 'https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/fetchRaces';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: filters,
      body: JSON.stringify({ ...filters, page: currentPage }), // Pass filters and page array as JSON
    });

    if (response.ok) {
        const results = await response.json();
        console.log('Results fetched from Vercel function:', results);
        raceResultsJSON = results; // Assign results to global variable
        populateRaceCards(results); // Pass the calledByScroll parameter to the populateRaceCards function
        hideUnusedRaceCards(); // Pass the calledByScroll parameter to the hideUnusedRaceCards function
      } else {
        console.log('No saved races found via Vercel function.');
        hideUnusedRaceCards(); // Hide all race cards if no results found
      }
    } catch (error) {
      console.error('An error occurred while fetching races from Vercel function:', error);
      hideUnusedRaceCards(); // Hide all race cards if an error occurs
    }
}

// Wait for the previous results to load before fetching the next set of results
let isLoading = false; // Add a global variable to track whether a page is currently being loaded

// Function to check if the user has scrolled to the bottom
function checkScroll(filters) {
  if (!isLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight) { // Check if a page is not currently being loaded
    isLoading = true; // Set isLoading to true to indicate that a page is being loaded

    // Call createRaceCards function only when isLoading is true
    createRaceCards();

    currentPage++; // Increment the current page number
    //fetchRacesFromVercel(filters).then(() => {
    isLoading = false; // Set isLoading to false to indicate that the page has finished loading
    //}); // Fetch the next set of races
  }
}

// Listen for the scroll event
window.addEventListener('scroll', checkScroll);

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

// Function to create 20 race cards
function createRaceCards() {
  const raceCardTemplate = document.getElementById("race-card");
  const raceCardsContainer = document.getElementById("race-grid-container");

  for (let i = 0; i < 20; i++) {
    const newRaceCard = raceCardTemplate.cloneNode(true);
    newRaceCard.removeAttribute('id');
    newRaceCard.classList.add('greyed-out');
    raceCardsContainer.appendChild(newRaceCard);
  }
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
  const raceGrid = document.getElementById('race-grid-container'); 

  const existingRaceCards = Array.from(raceGrid.querySelectorAll('.race-card')); // Assuming all your race cards have a common class named 'race-card-class'

  /* Clear the contents of the race cards container
  if (!calledByScroll) { // Check if the function was called by the scroll event. If so, don't clear the container
  addGreyedOutClass();
  }*/

  // Loop through each result and create a new race card
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
});

// The function to add "greyed-out" class to divs with class "race-card-component"
function addGreyedOutClass() {
  // Find all the div elements with the class "race-card-component"
  const raceCardComponents = document.querySelectorAll('.race-card-component');
  
  // Loop through each div element found
  raceCardComponents.forEach(function(element) {
    // Add the class "greyed-out" to the div
    element.classList.add('greyed-out');
    
    // Log to the console to show the class has been added
    console.log(`Added 'greyed-out' class to element: ${element}`);
  });
}