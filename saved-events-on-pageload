<script>
const memberstack = window.$memberstackDom;

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().substr(-2);
  const formattedDate = `${day} ${month} ${year}`;
  console.log("Formatted date:", formattedDate);
  return formattedDate;
}

// Function to fetch saved races from Algolia
async function fetchSavedRacesFromAlgolia(objectIDs) {
  console.log("Starting to fetch saved races from Algolia...");
  
  const searchClient = algoliasearch('CWUIX0EWFE', '4cd4c82105f395affbc472c07a9789c8');
  const index = searchClient.initIndex('treccy_races_all');
  
  console.log("Algolia index initialized as:", index);
  console.log("Object IDs to search for:", objectIDs);

  try {
    index.getObjects(objectIDs).then(({ results }) => {
      console.log("Algolia Search Results:", results);
      
      // If results are available, populate the race cards
      if (results && results.length > 0) {
        populateRaceCards(results);
      } else {
        console.log("No saved races found in Algolia.");
      }
    }).catch(error => {
      console.log("An error occurred within the getObjects promise:", error);
    });
  } catch (error) {
    console.log("An error occurred while fetching Algolia results:", error);
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
    newRaceCard.style.display = 'block';

    const formattedDate = formatDate(result.date_ag);
    newRaceCard.querySelector('.race-card-top-block').href = `/races/${result.slug_ag}`;
    newRaceCard.querySelector('.race-card-image').src = result.photo_main_ag;
    newRaceCard.querySelector('.race-card-image').alt = result.name_ag;
    newRaceCard.querySelector('.card-text-link-block').href = `/races/${result.slug_ag}`;
    newRaceCard.querySelector('.race-card-heading').textContent = result.name_ag;
    newRaceCard.querySelector('.race-card-heading-right').textContent = result.distance_ag;
    newRaceCard.querySelector('.race-city-text').textContent = result.city_ag;
    newRaceCard.querySelector('.race-country-text').textContent = result.country_ag;
    newRaceCard.querySelector('.race-card-date-text').textContent = formattedDate;

    algoliaRacesDiv.appendChild(newRaceCard);
  });
}

// Fetching the member data and liked race IDs
async function fetchLikes() {
  let memberJson = await memberstack.getMemberJSON();
  while (memberJson.data) {
    memberJson = memberJson.data;
  }

  // Check if likes exist and map them to an array of IDs
  let likesArray = [];
  if (memberJson.likes && memberJson.likes.length > 0) {
    likesArray = memberJson.likes.map(like => like.id);
  }

  // Call fetchSavedRacesFromAlgolia with the event IDs
  fetchSavedRacesFromAlgolia(likesArray);
}

// Trigger the entire process
fetchLikes();
</script>
