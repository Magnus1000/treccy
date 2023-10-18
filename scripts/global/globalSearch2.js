// Function to send a view event to Algolia
function sendViewEventToAlgolia() {
    const algolia_id_wf = document.body.getAttribute('algolia_object_id_wf'); // Assuming algolia_id_wf is set as an attribute on the body tag

    if (algolia_id_wf) {
        // Check if there is user token in local storage
        const userToken = checkUserToken();
        
        // Send view event to Algolia with user token
        aa('viewedObjectIDs', {
            index: 'races', // Replace with your Algolia index name
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

        // Import Algolia autocomplete package
        const { autocomplete } = window['@algolia/autocomplete-js'];
        
        // Initialize Algolia Insights
        window.aa('init', {
            appId: appId,
            apiKey: apiKey
        });

        // Send view event to Algolia
        sendViewEventToAlgolia();

        //I might want to consolidate this with the other url params function at some point
        // Check if user location is in URL params
        const urlParams = new URLSearchParams(window.location.search);
        let lat = urlParams.get('lat');
        let lng = urlParams.get('lng');
        if (!lat || !lng) {
            // Check if user location is in local storage
            const localStorageUserLocation = localStorage.getItem('userLocation');
            if (localStorageUserLocation) {
                [lat, lng] = JSON.parse(localStorageUserLocation);
            } else {
                // Get user location if not in local storage
                const userLocationArray = await getUserLocation();
                [lat, lng, [location]] = userLocationArray;
            }
        }

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

// Call the function to fetch keys and initialize Algolia
fetchAlgoliaKeysAndInit();