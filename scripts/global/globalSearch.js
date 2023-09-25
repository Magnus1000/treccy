// Placeholder texts for search bar
const placeholderTexts = [
  "Search for Kayak races",
  "Search for Running races",
  "Search for Cycling races",
  "Search for Mountain Bike races",
];

let placeholderIndex = 0;

// Function to update the placeholder text
function updatePlaceholder(autocompleteInstance) {
  autocompleteInstance.update({
    placeholder: placeholderTexts[placeholderIndex]
  });
  placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length;
}

// Convert text to Title Case
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Algolia setup
const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];
const appId = "CWUIX0EWFE";
const apiKey = "4cd4c82105f395affbc472c07a9789c8";
const searchClient = algoliasearch(appId, apiKey);
const indexName = "treccy_races_all";

// Initialize Algolia Autocomplete
const autocompleteInstance = autocomplete({
  container: "#global-race-search",
  placeholder: placeholderTexts[placeholderIndex],
  detachedMediaQuery: '',
  openOnFocus: true,
  getSources({ query, state }) {
    console.log("Query received:", query);

    if (!query) {
      console.log("No query.");
      return [];
    }

    // Rest of the code for Algolia search results
    return [
      {
        sourceId: "races",
        async getItems() {
          console.log("Fetching results from Algolia...");
          try {
            const results = await getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: indexName,
                  query,
                  params: {
                    attributesToSnippet: ['name_ag:10', 'description_ag:35'],
                    snippetEllipsisText: '…',
                    hitsPerPage: 5,
                    facets: ['sports_ag', 'city_ag', 'region_ag', 'country_ag']
                  }
                }
              ]
            });
            console.log("Results from Algolia:", results);
            return results;
          } catch (error) {
            console.error("Error fetching results from Algolia:", error);
            return [];
          }
        },
        templates: {
          item({ item, components, html }) {
            // Extract the date from item.date_ag and format it
            const date = new Date(item.date_ag);
            const formattedDate = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
            // Convert disciplines to proper case
            const sports = toTitleCase(item.sports_ag.join(', '));

            return html`
              <a class="aa-ItemLink" href="/race/${item.slug_ag}">
                <div class="aa-ItemContent">
                  <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle">
                      ${item.name_ag} 
                    </div>
                    <div class="aa-ItemContentSubtitle">
                      ${item.city_ag}, ${item.region_ag}, ${item.country_ag} - ${formattedDate} 
                    </div>
                    <div class="aa-ItemContentDescription">
                      ${sports} 
                    </div>
                  </div>
                </div>
              </a>`;
          },
          footer({ state, html }) {
            console.log("State:", state);
            // Check if results are available
            if (state.results && state.results[0]) {
              // Iterate over the hits to find one with the necessary attributes
              const hit = state.results[0].hits.find(hit => {
                const hasSport = hit.sports_ag && hit.sports_ag.length > 0;
                const hasRegion = hit.region_ag && hit.region_ag.length > 0;
                const hasCity = hit.city_ag && hit.city_ag.length > 0;
                const hasCountry = hit.country_ag && hit.country_ag.length > 0;
                return hasSport && (hasRegion || hasCity || hasCountry);
              });
              if (hit) {
                const sports = toTitleCase(hit.sports_ag.join(', '));
                const city = hit.city_ag;
                const region = hit.region_ag;
                const countryAgLower = hit.country_ag.toLowerCase();
                let categoryLink = '';
                if (region) {
                  categoryLink = `/regions/${region.toLowerCase()}?sport0=${state.query.toLowerCase()}&location=${region}%2C+${countryAgLower}`;
                } else if (city) {
                  categoryLink = `/cities/${city.toLowerCase()}?sport0=${state.query.toLowerCase()}&location=${city}%2C+${countryAgLower}`;
                } else if (countryAgLower) {
                  categoryLink = `/countries/${countryAgLower}?sport0=${state.query.toLowerCase()}&location=${countryAgLower}`;
                }
                const footerDiv = html`<div><a href="${categoryLink}">See all ${sports} races in ${city || region || countryAgLower}</a></div>`;
                const sourceFooter = document.querySelector('.aa-SourceFooter');
                if (sourceFooter) {
                  sourceFooter.appendChild(footerDiv);
                  console.log(`Category link added: ${categoryLink}`);
                  return;
                }
              }
            }
            const footerDiv = html`<div></div>`;
            const sourceFooter = document.querySelector('.aa-SourceFooter');
            if (sourceFooter) {
              sourceFooter.appendChild(footerDiv);
            }
            console.log("No category link added.");
          },
          noResults() {
            return "No races for this query.";
          }
        },
        getItemUrl({ item }) {
          return "/race/" + item.slug_ag;
        },
      },
    ];
  }
});

// Start rotating placeholder texts
startPlaceholderRotation(autocompleteInstance);

console.log("Algolia Global Search initialized.");

document.addEventListener('keydown', (event) => {
  if (event.metaKey && event.key.toLowerCase() === 'k') {
    autocompleteInstance.setIsOpen(true); // Use the instance's method
  }
});