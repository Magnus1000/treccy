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

// Function to populate race cards
function populateRaceCards(results) {
  console.log("Populating Race Cards...");
  const algoliaRacesDiv = document.getElementById('algoliaRaces');
  
  results.forEach(result => {
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
    newRaceCard.querySelector('.race-card-heading-right').textContent = result.distance_ag;
    newRaceCard.querySelector('.race-city-text').textContent = result.city_ag;
    newRaceCard.querySelector('.race-country-text').textContent = result.country_ag;
    newRaceCard.querySelector('.race-card-date-text').textContent = formattedDate;
    newRaceCard.querySelector('.like-button-div .like-button').setAttribute('data-object-id', result.objectID);
    
    algoliaRacesDiv.appendChild(newRaceCard);
  });
  
  // Call initLikeButtons here, after new content has been added
  console.log("New cards populated. Re-initializing like-buttons.");
  initLikeButtons();  
}

// Trigger the entire process
fetchLikes();
</script>
