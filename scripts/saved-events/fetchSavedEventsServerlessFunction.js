// Fetching the member data and liked race IDs
async function fetchLikes() {
  showGreyedOutState(); // Show greyed-out state
  let memberJson = await memberstack.getMemberJSON();
  while (memberJson.data) {
    memberJson = memberJson.data;
  }

  let likesArray = [];
  if (memberJson.likes && memberJson.likes.length > 0) {
    likesArray = memberJson.likes.map(like => like.id);
  }

  fetchSavedRacesFromVercel(likesArray);
}

// Function to fetch saved races from Vercel function
async function fetchSavedRacesFromVercel(objectIDs) {
  const apiUrl = 'https://treccy-serverside-magnus1000.vercel.app/api/fetchSavedRaces';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objectIDs }),
    });

    if (response.ok) {
      const results = await response.json();
      console.log('Results fetched from Vercel function:', results);
      populateRaceCards(results);
    } else {
      console.log('No saved races found via Vercel function.');
    }
  } catch (error) {
    console.error('An error occurred while fetching races from Vercel function:', error);
  }
}

// Function to show greyed-out state
function showGreyedOutState() {
  console.log("Showing greyed-out state...");
  const algoliaRacesDiv = document.getElementById('algoliaRaces');
  
  for(let i = 0; i < 20; i++) {
    const newRaceCard = createRaceCard(true);
    algoliaRacesDiv.appendChild(newRaceCard);
  }
}

// Function to remove greyed-out state
function removeGreyedOutState() {
  console.log("Removing greyed-out state...");
  const greyedOutElements = document.querySelectorAll('.greyed-out');
  
  greyedOutElements.forEach(element => {
    element.remove();
  });
}

// Function to create a race card
function createRaceCard(isGreyedOut = false) {
  const raceCardTemplate = document.getElementById("race-card");
  const newRaceCard = raceCardTemplate.cloneNode(true);
  newRaceCard.removeAttribute('id');
  newRaceCard.style.display = 'flex';
  if (isGreyedOut) {
    newRaceCard.className += ' greyed-out';
  }
  return newRaceCard;
}

// Function to populate race cards
function populateRaceCards(results) {
  removeGreyedOutState(); // Remove greyed-out state
  console.log("Populating Race Cards...");
  
  results.forEach((result, index) => {
    const existingRaceCards = document.querySelectorAll('.race-card-template-class'); // Replace with your actual class name
    if (existingRaceCards && existingRaceCards[index]) {
      const raceCardToPopulate = existingRaceCards[index];
      
      // Your logic to populate each existing card goes here
      // For example:
      const formattedDate = formatDate(result.date_ag);
      raceCardToPopulate.querySelector('.race-card-top-block').href = `/race/${result.slug_ag}`;
      raceCardToPopulate.querySelector('.race-card-image').src = result.photo_main_ag;
      raceCardToPopulate.querySelector('.race-card-image').alt = result.name_ag;
      raceCardToPopulate.querySelector('.card-text-link-block').href = `/races/${result.slug_ag}`;
      raceCardToPopulate.querySelector('.race-card-heading').textContent = result.name_ag;
      raceCardToPopulate.querySelector('.race-card-heading-right').textContent = result.distance_ag;
      raceCardToPopulate.querySelector('.race-city-text').textContent = result.city_ag;
      raceCardToPopulate.querySelector('.race-country-text').textContent = result.country_ag;
      raceCardToPopulate.querySelector('.race-card-date-text').textContent = formattedDate;
      raceCardToPopulate.querySelector('.like-button-div .like-button').setAttribute('data-object-id', result.objectID);
    }
  });
  
  // Call initLikeButtons here, after new content has been added
  console.log("New cards populated. Re-initializing like-buttons.");
  initLikeButtons();  
}

// Trigger the entire process
fetchLikes();
