//Log the initiation of the script
console.log("globalSearch2.js script initiated");

// Import autocomplete from Algolia Autocomplete library
console.log('Importing autocomplete library...');
const { autocomplete } = window['@algolia/autocomplete-js'];
console.log('Autocomplete library loaded successfully!');

// Function to fetch Algolia API keys and initialize Algolia
async function fetchAlgoliaKeysAndInit() {
    try {
        console.log('Fetching Algolia API keys...');
        const response = await fetch('https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/initializeAlgolia.js');
        const { appId, apiKey } = await response.json();
        console.log(`Algolia API keys fetched: ${appId}, ${apiKey}`);

        console.log('Initializing Algolia Insights...');
        await initAlgoliaInsights(appId, apiKey);

        console.log('Algolia API keys fetched and Algolia Insights initialized.');
    } catch (error) {
        console.error('Error initializing Algolia:', error);
    }
}
// This is an asynchronous function to initialize Algolia Insights and Autocomplete
async function initAlgoliaInsights(appId, apiKey) {
    // Initialize Algolia Insights
    await window.aa('init', { appId, apiKey });
    
    // Send a view event to Algolia
    sendViewEventToAlgolia();
    
    // Log completion to the console
    console.log('Algolia Insights initialized and page view event sent.');
}

// Function to send a view event to Algolia
function sendViewEventToAlgolia() {
    const algolia_id_wf = document.body.getAttribute('algolia_object_id_wf');
    
    if (algolia_id_wf) {
        console.log('Checking for user token in local storage...');
        const userToken = checkUserToken();
        
        console.log(`Sending view event for objectID: ${algolia_id_wf}`);
        aa('viewedObjectIDs', {
            index: 'races',
            eventName: 'Page Viewed',
            objectIDs: [algolia_id_wf],
            userToken: userToken
        });
        
        console.log(`Sent view event for objectID: ${algolia_id_wf}`);
    } else {
        console.log('algolia_id_wf attribute not found. Cannot send view event.');
    }
}

// Fetch Algolia keys from the serverless function
async function fetchAlgoliaKeysAndInit() {
    try {
        const response = await fetch('https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/initializeAlgolia.js');
        const { appId, apiKey } = await response.json();
        console.log(`Algolia API keys fetched: ${appId}, ${apiKey}`);
        console.log('Initializing Algolia Insights...');
        await initAlgoliaInsights(appId, apiKey);
        console.log('Algolia API keys fetched and Algolia Insights initialized.');

        const autocompleteInstance = autocomplete({
            container: "#global-race-search",
            detachedMediaQuery: "",
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
                                const response = await fetch(
                                    `https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/fetchRaceCategoriesAlgolia?query=${query}&lat=${lat}&lng=${lng}`
                                );
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
                                    // Check if there is user token in local storage
                                    const userToken = checkUserToken();
                                    // Send click event to Algolia with user token
                                    window.aa('clickedObjectIDs', {
                                        index: 'races', // Replace with your Algolia index name
                                        eventName: 'Item Clicked',
                                        objectIDs: [item.objectID],
                                        userToken: userToken
                                    });
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
                                const response = await fetch(
                                    `https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/globalSearchServerless.js?query=${query}&lat=${lat}&lng=${lng}&aroundLatLng=${lat},${lng}&aroundRadius=100000`
                                );
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
                                    window.aa("clickedObjectIDsAfterSearch", {
                                        eventName: "Item Clicked",
                                        index: "races",
                                        objectIDs: [item.objectID],
                                        queryID: item.__queryID,
                                        // Check if there is user token in local storage
                                        userToken: checkUserToken()
                                    });
                                };

                                // Extract the date from item.date_ag and format it
                                const date = new Date(item.date_ag);
                                const formattedDate = `${date.getDate()} ${date.toLocaleString(
                                    "en-US",
                                    { month: "short" }
                                )} ${date.getFullYear()}`;
                                // Convert disciplines to proper case
                                const sports = toTitleCase(item.sports_ag.join(", "));

                                return html`
                                    <a
                                        class="aa-ItemLink"
                                        href="/race/${item.slug_ag}"
                                        onclick="${onClickHandler}"
                                    >
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
                                        if (
                                            hit.sports_ag &&
                                            hit.city_ag &&
                                            hit.region_ag &&
                                            hit.country_ag
                                        ) {
                                            const sports = toTitleCase(hit.sports_ag.join(", "));
                                            const city = hit.city_ag;
                                            const region = hit.region_ag;
                                            const countryAgLower = hit.country_ag.toLowerCase();
                                            const categoryLink = `/countries/${countryAgLower}?sport0=${state.query.toLowerCase()}&location=${city}%2C+${region}%2C+${countryAgLower}`;
                                            return html`<div><a href="${categoryLink}">See all ${sports} races in ${city}, ${region}</a></div>`;
                                        }
                                    }
                                }
                                return "";
                            },
                            noResults() {
                                return "No races for this query.";
                            },
                        },
                        getItemUrl({ item }) {
                            return "/race/" + item.slug_ag;
                        },
                    },
                ];
            },
        });

        console.log("Algolia Global Search initialized.");

        document.addEventListener('keydown', (event) => {
            if (event.metaKey && event.key.toLowerCase() === 'k') {
                autocompleteInstance.setIsOpen(true); // Use the instance's method
            }
        });
    } catch (error) {
        console.error('Error fetching Algolia keys:', error);
    }
}

// Function to convert text to Title Case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
