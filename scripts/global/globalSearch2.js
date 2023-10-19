//Log the initiation of the script
console.log("globalSearch2.js script initiated");

// Import autocomplete from Algolia Autocomplete library
const { autocomplete } = window['@algolia/autocomplete-js'];

// Function to fetch Algolia API keys and initialize Algolia
async function fetchAlgoliaKeysAndInit() {
try {
    // Fetch API keys for Algolia
    const response = await fetch('https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/initializeAlgolia.js');
    const { appId, apiKey } = await response.json();

    // Initialize Algolia Insights and Autocomplete
    await initAlgoliaInsights(appId, apiKey);

    // Log completion
    console.log('Algolia API keys fetched and Algolia Insights initialized.');
} catch (error) {
    console.error('Error initializing Algolia:', error); // Log errors
}
}

// Function to initialize Algolia Insights and send page view event
async function initAlgoliaInsights(appId, apiKey) {
await autocomplete({
    appId,
    apiKey,
    onLoad: async () => {
    await window.aa('init', { appId, apiKey });
    await sendViewEventToAlgolia();
    console.log('Algolia Insights initialized and page view event sent.'); // Log success
    },
});
}

async function sendViewEventToAlgolia() {
    await window.aa('viewedObjectIDs', {
        index: 'races',
        eventName: 'Viewed Search Page',
    });
}

// Function to populate the search bar with results and suggestions
function initAutocomplete(lat, lng) {
    console.log('Initializing autocomplete with lat:', lat, 'and lng:', lng);
    return autocomplete({
        container: '#global-race-search',
        detachedMediaQuery: '',
        openOnFocus: true,
        insights: true,
        getSources({ query }) {
            if (!query) {
                return [];
            }
            return [
                {
                    sourceId: 'region_sports',
                    getItems: () => fetchRaceCategoriesAlgolia(query, lat, lng),
                    templates: {
                        header: ({ html }) => html`<div class="aa-SourceHeader">SUGGESTIONS</div>`,
                        item: ({ item, html }) => html`
                            <a class="aa-ItemLink" href="https://www.treccy.com/${item.region_ag}">
                                <div class="aa-ItemContent">
                                    <div class="aa-ItemContentTitleSuggestions">${item.name_ag}</div>
                                </div>
                            </a>
                        `,
                    },
                },
                {
                    sourceId: 'races',
                    getItems: () => fetchGlobalSearchResults(query, lat, lng),
                    templates: {
                        header: ({ html }) => html`<div class="aa-SourceHeader">RACES</div>`,
                        item: ({ item, html }) => html`
                            <a class="aa-ItemLink" href="/race/${item.slug_ag}">
                                <div class="aa-ItemContent">
                                    <div class="aa-ItemContentBody">
                                        <div class="aa-ItemContentTitle">${item.name_ag}</div>
                                        <div class="aa-ItemContentSubtitle">${item.city_ag}, ${item.region_ag}, ${item.country_ag}</div>
                                        <div class="aa-flex-container">
                                            <div class="date-container">${formatDate(item.date_ag)}</div>
                                            <div class="sports-container">${toTitleCase(item.sports_ag.join(', '))}</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        `,
                        footer: ({ state, html }) => {
                            const hit = state.results?.[0]?.hits?.find(hit => hit.sports_ag && hit.city_ag && hit.region_ag && hit.country_ag);
                            if (!hit) {
                                return '';
                            }
                            const sports = toTitleCase(hit.sports_ag.join(', '));
                            const city = hit.city_ag;
                            const region = hit.region_ag;
                            const countryAgLower = hit.country_ag.toLowerCase();
                            const categoryLink = `/countries/${countryAgLower}?sport0=${state.query.toLowerCase()}&location=${city}%2C+${region}%2C+${countryAgLower}`;
                            return html`<div><a href="${categoryLink}">See all ${sports} races in ${city}, ${region}</a></div>`;
                        },
                        noResults: () => 'No races for this query.',
                    },
                    getItemUrl: ({ item }) => `/race/${item.slug_ag}`,
                },
            ];
        },
    });
}

function addKeyboardShortcutToOpenAutocomplete(autocompleteInstance) {
    document.addEventListener('keydown', (event) => {
        if (event.metaKey && event.key.toLowerCase() === 'k') {
            autocompleteInstance.setIsOpen(true);
        }
    });
}

async function fetchRaceCategoriesAlgolia(query, lat, lng) {
    const response = await fetch(`https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/fetchRaceCategoriesAlgolia?query=${query}&lat=${lat}&lng=${lng}`);
    const results = await response.json();
    console.log('Results for region sports:', results);
    return results;
}

async function fetchGlobalSearchResults(query, lat, lng) {
    const response = await fetch(`https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/globalSearchServerless.js?query=${query}&lat=${lat}&lng=${lng}&aroundLatLng=${lat},${lng}&aroundRadius=100000`);
    const results = await response.json();
    console.log('Results from Vercel function:', results);
    return results;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Function to call the fetchAlgoliaKeysAndInit function on pageload
document.addEventListener('DOMContentLoaded', fetchAlgoliaKeysAndInit);
