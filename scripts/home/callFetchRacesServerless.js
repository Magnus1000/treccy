// Log the initiation of the script
console.log("callFetchRacesServerless.js script initiated");

let currentPage = 0; // Initialize current page to 0 for Algolia's zero-based pagination

const extractURLParams = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  let params = {};
  for (const [key, value] of urlSearchParams.entries()) {
    if (/^sport\d+$/.test(key)) {
      params.sports = params.sports || [];
      params.sports.push(value.replace(/-/g, ' '));
    } else if (key === 'lat') {
      lat = parseFloat(value);
      console.log(`Global variable lat ${lat} set from URL in extractURLParams function`);
    } else if (key === 'lng') {
      lng = parseFloat(value);
      console.log(`Global variable lng ${lng} set from URL in extractURLParams function`);
    } else {
      params[key] = value;
    }
  }
  console.log("Extracted URL parameters: ", params);
  return params;
};

async function checkURLParams() {
    const params = extractURLParams();
    const sports = params.sports || [];
    const minDist = parseInt(params.minDist);
    const maxDist = parseInt(params.maxDist);
    const dateFrom = parseInt(params.fromDate);
    const dateTo = parseInt(params.toDate);
    const radius = parseInt(params.radius);
    let lat = parseFloat(params.lat);
    let lng = parseFloat(params.lng);

  if (isNaN(lat) || isNaN(lng)) {
    const userLocationArray = await getUserLocation();
    // Lat and lng are already reassigned globally in getUserLocation function so keeping it local here
    lat = userLocationArray[0]; 
    lng = userLocationArray[1];
    if (isNaN(lat) || isNaN(lng)) {
      console.log(`Using lat:40.014 and lng:105.270 as fourth fallback option`);
      lat = 40.014;
      console.log(`Global variable lat ${lat} set from fourth fallback option in checkURLParams function`);
      lng = -105.270;
      console.log(`Global variable lng ${lng} set from fourth fallback option in checkURLParams function`);
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
    await fetchRacesFromVercel(filters);
  } catch (error) {
    console.error(`Error fetching races: ${error}`);
  }

  // Call updateFormFieldsFromURL with params as an argument
  updateFormFieldsFromURL(params);
}

// Function to fetch races races from Vercel function
async function fetchRacesFromVercel(filters, currentPage) {
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
        await populateRaceCards(results); // Waiting for populateRaceCards to finish before calling hideUnusedRaceCards function
        hideUnusedRaceCards(); 
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
async function checkScroll(filters) {
  if (!isLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight) { // Check if a page is not currently being loaded
    isLoading = true; // Set isLoading to true to indicate that a page is being loaded

    // Call createRaceCards function with the fetched races
    await createRaceCards();

    currentPage++; // Increment the current page number
    console.log(`Current page number: ${currentPage}`);

    // Call fetchRacesFromVercel with the current page number and filters
    const races = await fetchRacesFromVercel(filters, currentPage);

    isLoading = false; // Set isLoading to false to indicate that the page has finished loading
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
async function createRaceCards() {
  const raceCardTemplate = await clearRaceCardData();
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

// Function to populate the cards with results from algolia
async function populateRaceCards(results) {
  console.log("Populating Race Cards...");
  //Find the container the cards are in
  const raceGrid = document.getElementById('race-grid-container'); 

  //Find the cards that are greyed out to populate with search result data
  const existingRaceCards = Array.from(raceGrid.querySelectorAll('.race-card.greyed-out'));

  // Populate each card with the search result data
  results.forEach((result, index) => {

    try {
      let raceCardToPopulate; // Declare the variable outside of try to make it accessible in the catch block
      if (existingRaceCards[index]) { // Check to ensure an existing card is available to populate
        const raceCardToPopulate = existingRaceCards[index];
        const formattedDate = formatDate(result.date_ag);
        const raceCardTopBlock = raceCardToPopulate.querySelector('.race-card-top-block');
        removeGreyedOutFromElementAndChildren(raceCardToPopulate);
        // If statement to check if raceCardTopBlock exists
        if (raceCardTopBlock) {
          raceCardTopBlock.setAttribute('href', `/race/${result.slug_ag}`);
        }
        const raceCardImage = raceCardToPopulate.querySelector('.race-card-image');
        // If statement to check if raceCardImage exists
        if (raceCardImage) {
          raceCardImage.setAttribute('src', result.photo_main_ag);
          raceCardImage.setAttribute('alt', result.name_ag);
        }
        const cardTextLinkBlock = raceCardToPopulate.querySelector('.card-text-link-block');
        // If statement to check if cardTextLinkBlock exists
        if (cardTextLinkBlock) {
          cardTextLinkBlock.setAttribute('href', `/race/${result.slug_ag}`);
        }
        const raceCardHeading = raceCardToPopulate.querySelector('.race-card-heading');
        // If statement to check if raceCardHeading exists
        if (raceCardHeading) {
          raceCardHeading.textContent = result.name_ag;
        }
        const raceCardDisplayDistance = raceCardToPopulate.querySelector('.race-card-display-distance');
        if (raceCardDisplayDistance) {
          raceCardDisplayDistance.textContent = result.distances_display_ag;
        }
        const raceCityText = raceCardToPopulate.querySelector('.race-city-text');
        if (raceCityText) {
          raceCityText.textContent = result.city_ag;
        }
        const raceCountryText = raceCardToPopulate.querySelector('.race-region-text');
        if (raceCountryText) {
          raceCountryText.textContent = result.region_ag;
        }
        const raceSportText = raceCardToPopulate.querySelector('.race-sport-text');
        if (raceSportText) {
          raceSportText.textContent = result.sports_display_ag;
        }
        const raceCardDateText = raceCardToPopulate.querySelector('.race-card-date-text');
        if (raceCardDateText) {
          raceCardDateText.textContent = formattedDate;
        }
        const likeButton = raceCardToPopulate.querySelector('.like-button-div .like-button');
        if (likeButton) {
          likeButton.setAttribute('data-object-id', result.objectID);
        }
      }
    } catch (error) {
      console.error(`Error populating race card ${index}: ${error}`);
    }
  }); 
}

// Helper function to set an element's value by its ID
const setElementValue = (id, value) => {
  console.trace();
  const elem = document.getElementById(id);
  if (elem) {
      elem.value = value;
  }
};

// Function to update the form fields based on the URL params
const updateFormFieldsFromURL = (params) => {
  console.trace();
  // Check if params is undefined or null
  if (!params) {
    console.warn("Missing params argument in updateFormFieldsFromURL, extracting from URL again");
    params = extractURLParams();
  }
  let lat = params.lat;
  let lng = params.lng;
  let location = params.location;

  // If lat, lng, or location are not available in the URL params, check localStorage
  if (!lat || !lng || !location) {
    const localStorageUserLocation = JSON.parse(localStorage.getItem('userLocation'));
    if (localStorageUserLocation) {
      lat = lat || localStorageUserLocation[0];
      lng = lng || localStorageUserLocation[1];
      location = location || localStorageUserLocation[2];
    }
  }

  // Update sport checkboxes based on 'sport' URL params
  if (params.sports) {
    params.sports.forEach((value) => {
      const checkbox = document.querySelector(`.sport-checkbox[filter-value="${value}"]`);
      checkbox.checked = true;
      const parentWrapper = checkbox.closest('.sport-checkbox-button');
      parentWrapper.classList.add('selected');
    });
  }

  // Update other form fields based on the remaining URL params
  const fieldMappings = {
    minDist: value => setElementValue('minimum-distance', value / 1000),
    maxDist: value => setElementValue('maximum-distance', value / 1000),
    radius: value => setElementValue('location-radius', value),
    fromDate: value => {},
    toDate: value => {},
  };

  // Update lat, lng, and location form fields
  if (lat && lng && location) {
    const locationSearchBar = document.getElementById('location-search-bar');
    console.log(`Location search bar value set from ${lat && lng ? 'URL' : 'localStorage'}: ${location}`);
    if (locationSearchBar) {
      locationSearchBar.setAttribute('data-lat', lat);
      locationSearchBar.setAttribute('data-lon', lng);
      locationSearchBar.value = location; // Set the value of the location search bar
    }
  }

  // Update other form fields based on the remaining URL params
  for (const [key, value] of Object.entries(params)) {
    const updateField = fieldMappings[key];
    if (updateField) {
      updateField(value);
    }
  }
};

// This function returns a cleared version of the FIRST element that has a class of 'race-card'
function getEmptyRaceCardTemplate() {
  const raceCardElement = document.querySelector('.race-card');

  if (raceCardElement) {
    const newRaceCardElement = raceCardElement.cloneNode(true);

    // Add the greyed-out class to the parent element
    newRaceCardElement.classList.add('greyed-out');

    // Add the greyed-out class to each child element
    const raceCardImage = newRaceCardElement.querySelector('.race-card-image');
    const raceCardHeading = newRaceCardElement.querySelector('.race-card-heading');
    const raceCityText = newRaceCardElement.querySelector('.race-city-text');
    const raceRegionText = newRaceCardElement.querySelector('.race-region-text');
    const raceCardDateText = newRaceCardElement.querySelector('.race-card-date-text');
    const raceSportText = newRaceCardElement.querySelector('.race-sport-text');
    const raceCardDisplayDistance = newRaceCardElement.querySelector('.race-card-display-distance');

    if (raceCardImage) raceCardImage.classList.add('greyed-out');
    if (raceCardHeading) raceCardHeading.classList.add('greyed-out');
    if (raceCityText) raceCityText.classList.add('greyed-out');
    if (raceRegionText) raceRegionText.classList.add('greyed-out');
    if (raceCardDateText) raceCardDateText.classList.add('greyed-out');
    if (raceSportText) raceSportText.classList.add('greyed-out');
    if (raceCardDisplayDistance) raceCardDisplayDistance.classList.add('greyed-out');

    // Clear data in each child element
    if (raceCardImage) raceCardImage.src = '';
    if (raceCardHeading) raceCardHeading.innerText = '';
    if (raceCityText) raceCityText.innerText = '';
    if (raceRegionText) raceRegionText.innerText = '';
    if (raceCardDateText) raceCardDateText.innerText = '';
    if (raceSportText) raceSportText.innerText = '';
    if (raceCardDisplayDistance) raceCardDisplayDistance.innerText = '';

    return newRaceCardElement;
  } else {
    console.log('Element with class "race-card" not found');
    return null;
  }
}

//Function to call all the functions that need to be called when the page loads
document.addEventListener("DOMContentLoaded", async function() {
  const filters = await checkURLParams();
});
document.addEventListener('DOMContentLoaded', async function() {
  await fetchAlgoliaKeysAndInit();
});
document.addEventListener("DOMContentLoaded", function() {
  const locationButton = document.getElementById("location-button");
  locationButton.addEventListener("click", getLocationAndPopulateField);
});