<script>
// --------------- Global Variables and Configuration ---------------
console.log("Script Initiated");

const algoliaConfig = {
    appId: "CWUIX0EWFE",
    apiKey: "4cd4c82105f395affbc472c07a9789c8",
    indexName: 'treccy_races_all'
};

// Function to populate race cards
function populateRaceCards(results) {
    console.log("Populating Race Cards...");
    
    const algoliaRacesDiv = document.getElementById('algoliaRaces');
    
    results.forEach(result => {
        // Cloning and preparing the new card
        const raceCardTemplate = document.getElementById("race-card");
				const newRaceCard = raceCardTemplate.cloneNode(true);
			  newRaceCard.removeAttribute('id');
				newRaceCard.style.display = 'flex';

        // Formatting the date
        const formattedDate = formatDate(result.date_ag);

        // Populating the card data
        newRaceCard.querySelector('.race-card-top-block').href = `/races/${result.slug_ag}`;
        newRaceCard.querySelector('.race-card-image').src = result.photo_main_ag;
        newRaceCard.querySelector('.race-card-image').alt = result.name_ag;
        newRaceCard.querySelector('.card-text-link-block').href = `/races/${result.slug_ag}`;
        newRaceCard.querySelector('.race-card-heading').textContent = result.name_ag;
        newRaceCard.querySelector('.race-card-heading-right').textContent = result.distance_ag;
        newRaceCard.querySelector('.race-city-text').textContent = result.city_ag;
        newRaceCard.querySelector('.race-country-text').textContent = result.city_ag;
        newRaceCard.querySelector('.race-card-date-text').textContent = formattedDate;
        
        // Adding the new card to the DOM
        algoliaRacesDiv.appendChild(newRaceCard);
        
        onNewContentAdded();
    });

    console.log("New cards populated. Re-initializing like-buttons.");
}

// Function to extract region from URL
function getRegionFromURL() {
    console.log("Extracting region from URL...");
    const urlPathname = window.location.pathname;
    const segments = urlPathname.split('/');
    let region = segments[2];
    region = region.replace(/-/g, ' ');
    return region;
}

// Function to format date
function formatDate(dateString) {
    console.log("Formatting date...");
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
}

// Function to fetch Algolia Results
async function fetchAlgoliaResults() {
    console.log("Fetching Algolia Results...");

    const region = getRegionFromURL(); // Extract region from URL
    const filters = [`region_ag:"${region}"`]; // Initialize filters with region

    // Create an array to hold sports filters
    const sportsFilters = [];

    // Parse URL search parameters
    const urlSearchParams = new URLSearchParams(window.location.search);

    // Iterate through all parameters and build the filters dynamically
    urlSearchParams.forEach((value, key) => {
        // Check if the parameter key starts with 'sport' and add it to the sportsFilters array
        if (key.startsWith('sport')) {
            sportsFilters.push(`sports_ag:${value}`);
        }
    });

    // If there are sports filters, add them to the main filters
    if (sportsFilters.length > 0) {
        const sportsFilterStr = sportsFilters.join(' OR ');
        filters.push(`(${sportsFilterStr})`);
    }

    // Prepare search parameters
    const searchParams = {
        hitsPerPage: 20,
        filters: filters.join(' AND ')
    };

    // Initialize Algolia client and search
    const searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
    const index = searchClient.initIndex(algoliaConfig.indexName);
    console.log("Filters being sent to Algolia:", filters);

    try {
        const results = await index.search('', searchParams);
        console.log("Algolia Search Results:", results);
        return results.hits;
    } catch (error) {
        console.error("An error occurred while fetching Algolia results:", error);
        return [];
    }
}

// Function to load Algolia results into the DOM
async function loadAlgoliaResultsToDiv() {
    console.log("Fetching and Displaying Algolia Results in Div...");
    clearRaceCardsWithoutID();
    const results = await fetchAlgoliaResults();
    populateRaceCards(results);
}

// Function to clear race cards without an id
function clearRaceCardsWithoutID() {
    console.log("Clearing race cards without an ID...");
  
    // Select all elements with the class .race-card
    const allRaceCards = document.querySelectorAll('.race-card');
  
    // Loop through each race card
    allRaceCards.forEach(card => {
        // Check if the race card doesn't have an id
        if (!card.id) {
            // Remove the race card from the DOM
            card.remove();
        }
    });
  
    console.log("Cleared race cards without an ID.");
}


// Entry point when the DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded. Initiating Algolia Results Fetch...");
    loadAlgoliaResultsToDiv();
});
</script>
