// Fetching the member data and liked race IDs
async function fetchLikes() {
  let memberJson = await memberstack.getMemberJSON();
  while (memberJson.data) {
    memberJson = memberJson.data;
  }

  let likesArray = [];
  if (memberJson.likes && memberJson.likes.length > 0) {
    likesArray = memberJson.likes.map(like => like.id);
  }

  // Cloning race card while the data is being fetched
  const algoliaRacesDiv = document.getElementById('algoliaRaces');
  for(let i = 0; i < 20; i++) {
    const newRaceCard = createRaceCard();
    algoliaRacesDiv.appendChild(newRaceCard);
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

// Function to populate race cards
function populateRaceCards(results) {
  console.log("Populating Race Cards...");
  
  results.forEach((result, index) => {
    const existingRaceCards = document.querySelectorAll('.race-card'); 
    if (existingRaceCards && existingRaceCards[index]) {
      const raceCardToPopulate = existingRaceCards[index];

      removeGreyedOutFromElementAndChildren(raceCardToPopulate);

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
