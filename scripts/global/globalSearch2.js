// Fetch Algolia keys from the serverless function
async function fetchAlgoliaKeysAndInit() {
try {
    const response = await fetch('https://treccy-serverside-magnus1000team.vercel.app/api/initializeAlgolia.js');
    const { appId, apiKey } = await response.json();
    
    // Initialize Algolia Insights
    window.aa('init', {
    appId: appId,
    apiKey: apiKey
    });
    
} catch (error) {
    console.error('Error fetching Algolia keys:', error);
}
}
// Call the function to fetch keys and initialize Algolia
fetchAlgoliaKeysAndInit();

// Function to convert text to Title Case
function toTitleCase(str) {
return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
});
}

// Import Algolia autocomplete package
const { autocomplete } = window['@algolia/autocomplete-js'];

// Initialize Algolia Autocomplete
const autocompleteInstance = autocomplete({
container: "#global-race-search",
detachedMediaQuery: '',
openOnFocus: true,
insights: true,
getSources({ query, state }) {
    console.log("Query received:", query);
    if (!query) {
    console.log("No query.");
    return [];
    }
    return [
    {
        sourceId: "region_sports",
        async getItems() {
        // Fetch from the serverless function for "treccy_region_sports_category"
        try {
            const response = await fetch(`https://treccy-serverside-magnus1000team.vercel.app/api/fetchRaceCategoriesAlgolia?query=${query}`);
            const results = await response.json();
            console.log("Results for region sports:", results);
            return results;
        } catch (error) {
            console.error("Error fetching results for region sports:", error);
            return [];
        }
        },
        templates: {
        header({ items, state, html }) {
            return html`
            <div class="aa-SourceHeader">SUGGESTIONS</div>
            `;
        },
        item({ item, components, html }) {
            const onClickHandler = () => {
            window.location.href = `https://www.treccy.com/${item.region_ag}`;
            };
            return html`
            <a class="aa-ItemLink" onclick="${onClickHandler}">
                <div class="aa-ItemContent">
                <div class="aa-ItemContentTitleSuggestions">
                    ${item.name_ag}
                </div>
                </div>
            </a>`;
        },
        },
    },
    {
        sourceId: "races",
        async getItems() {
        console.log("Fetching results from Vercel function...");

        // Call the serverless function hosted on Vercel
        try {
            const response = await fetch('https://treccy-serverside-magnus1000team.vercel.app/api/globalSearchServerless.js?query=' + query);
            const results = await response.json();

            console.log("Results from Vercel function:", results);

            return results;
        } catch (error) {
            console.error("Error fetching results from Vercel function:", error);
            return [];
        }
        },
        templates: {
        header({ items, state, html }) {
            return html`
            <div class="aa-SourceHeader">RESULTS</div>
            `;
        },
        item({ item, components, html }) {
            // Add Algolia Insights click event
            const onClickHandler = () => {
            window.aa('clickedObjectIDsAfterSearch', {
                eventName: 'Item Clicked',
                index: 'races',
                objectIDs: [item.objectID],
                queryID: item.__queryID,
            });
            };

            // Extract the date from item.date_ag and format it
            const date = new Date(item.date_ag);
            const formattedDate = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
            // Convert disciplines to proper case
            const sports = toTitleCase(item.sports_ag.join(', '));

            return html`
            <a class="aa-ItemLink" href="/race/${item.slug_ag}" onclick="${onClickHandler}">
                <div class="aa-ItemContent">
                <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle">
                    ${item.name_ag}
                    </div>
                    <div class="aa-ItemContentSubtitle">
                    ${item.city_ag}, ${item.region_ag}, ${item.country_ag}
                    </div>
                    <!-- The new flex div containing the date and sports -->
                    <div class="aa-flex-container">
                    <div class="date-container">
                        ${formattedDate}
                    </div>
                    <div class="sports-container">
                        ${sports}
                    </div>
                    </div>
                </div>
                </div>
            </a>`;
        },
        footer({ state, html }) {
            // Check if results are available
            if (state.results && state.results[0]) {
            // Iterate over the hits to find the first one with the necessary attributes
            for (const hit of state.results[0].hits) {
                if (hit.sports_ag && hit.city_ag && hit.region_ag && hit.country_ag) {
                const sports = toTitleCase(hit.sports_ag.join(', '));
                const city = hit.city_ag;
                const region = hit.region_ag;
                const countryAgLower = hit.country_ag.toLowerCase();
                const categoryLink = `/countries/${countryAgLower}?sport0=${state.query.toLowerCase()}&location=${city}%2C+${region}%2C+${countryAgLower}`;
                return html`<div><a href="${categoryLink}">See all ${sports} races in ${city}, ${region}</a></div>`;
                }
            }
            }
            return '';
        },
        noResults() {
            return "No races for this query.";
        }
        },
        getItemUrl({ item }) {
        return "/race/" + item.slug_ag;
        },
    }
    ];
}
});

console.log("Algolia Global Search initialized.");

document.addEventListener('keydown', (event) => {
if (event.metaKey && event.key.toLowerCase() === 'k') {
autocompleteInstance.setIsOpen(true); // Use the instance's method
}
});