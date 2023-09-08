<script>
  // Algolia configuration
  const algoliaConfig = {
    appId: "CWUIX0EWFE",
    apiKey: "4cd4c82105f395affbc472c07a9789c8",
    indexName: 'treccy_races_all'
  };

  // Date formatting function
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day} ${month} ${year}`;
    console.log("Formatted date:", formattedDate);
    return formattedDate;
  }

  // Function to fetch Algolia results based on user's sport and location
async function fetchAlgoliaResults(sport, lat, lng, rowClone) {
  const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
  const index = client.initIndex(algoliaConfig.indexName);

  // Logs for debugging
  console.log(`Initial lat and lng: ${lat}, ${lng}`);
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  console.log(`Parsed lat and lng: ${lat}, ${lng}`);

  try {
    const results = await index.search('', {
      filters: `sports_ag:${sport}`,
      aroundLatLng: `${lat},${lng}`,
      hitsPerPage: 10
    });

    // Log the results
    console.log(`Results for ${sport}`, results.hits);

    // Create a container to hold the cards
    const innerContainer = document.createElement('div');
    innerContainer.className = 'explore-page-results-inner';

    results.hits.forEach(result => {
      const newRaceCard = document.querySelector('.explore-race-card').cloneNode(true);

      const formattedDate = formatDate(result.date_ag);
      newRaceCard.querySelector('.race-card-top-block').href = `/races/${result.slug_ag}`;
      newRaceCard.querySelector('.race-card-image').src = result.photo_main_ag;
      newRaceCard.querySelector('.race-card-image').alt = result.name_ag;
      newRaceCard.querySelector('.card-text-link-block').href = `/races/${result.slug_ag}`;
      newRaceCard.querySelector('.race-card-heading').textContent = result.name_ag;
      newRaceCard.querySelector('.race-card-heading-right').textContent = result.distances_ag;
      newRaceCard.querySelector('.race-city-text').textContent = result.city_ag;
      newRaceCard.querySelector('.race-country-text').textContent = result.country_ag; 
      newRaceCard.querySelector('.race-card-date-text').textContent = formattedDate;
      newRaceCard.querySelector('.like-button-div .like-button').setAttribute('data-object-id', result.objectID); 
      innerContainer.appendChild(newRaceCard);
      
    // Call initLikeButtons here, after new content has been added
    console.log("New cards populated. Re-initializing like-buttons.");
    initLikeButtons();
    });

    // Append the inner container to the rowClone
    rowClone.appendChild(innerContainer);
   
    // Log the rowClone content for debugging
    console.log(`Row clone content for ${sport}: `, rowClone);

    // Locate the target div
    const targetDiv = document.querySelector("#explore-results-column");

    // Append the rowClone to the target div
    if (targetDiv) {
      targetDiv.appendChild(rowClone);
      console.log(`Appended rowClone to the #explore-results-column for ${sport}`);
    } else {
      console.error("The target div #explore-results-column does not exist.");
    }

    // Find the H2 element with the class 'explore-row-heading' in the rowClone
    const h2Element = rowClone.querySelector('.explore-row-heading');

    // Update the text content of the H2 element
    if (h2Element) {
      h2Element.textContent = `Explore ${sport} races near you`;
      console.log(`Updated H2 text content for ${sport}`);
    } else {
      console.error("The H2 element with class 'explore-row-heading' does not exist.");
    }

  } catch (error) {
    console.error(`Error fetching Algolia results for ${sport}:`, error);
  }
}

  (async () => {
    const memberstack = window.$memberstackDom;
    const memberData = await memberstack.getCurrentMember();

    let lat = memberData.data.customFields.lat;
    let lng = memberData.data.customFields.lng;

    let memberJson = await memberstack.getMemberJSON();
    let sportsData = memberJson.data ? memberJson.data : memberJson;

    if (sportsData && sportsData.sports) {
      sportsData.sports.forEach(async (sport, index) => {
        const rowTemplate = document.querySelector('#results_row').cloneNode(true);
        await fetchAlgoliaResults(sport, lat, lng, rowTemplate);
      });
    } else {
      console.error("Sports data is not available in MemberStack.");
    }
  })();
</script>
