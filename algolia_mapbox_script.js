<script>
    // Logging the initiation of our script
    console.log("Script Initiated");

    /**
     * Get the user's location
     */
    function getLocation() {
        console.log("Getting User Location...");
        
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation is not supported by your browser.');
            } else {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, () => {
                    reject('Unable to retrieve your location.');
                });
            }
        });
    }

    /**
     * Fetch 20 closest results from Algolia based on user's location and applied filters
     */
    async function fetchAlgoliaResults(lat, lng) {
        console.log("Fetching Algolia Results...");

        const filters = [];

        const appId = "CWUIX0EWFE";
        const apiKey = "4cd4c82105f395affbc472c07a9789c8";
        const searchClient = algoliasearch(appId, apiKey);
        const index = searchClient.initIndex('treccy_races_all');

        const disciplineFilterCheckbox = document.getElementById('disciplineFilter');
        if (disciplineFilterCheckbox.checked) {
            let disciplineFilterValue = disciplineFilterCheckbox.getAttribute('filter-value');
            if (disciplineFilterValue) {
                filters.push(`Disciplines:${disciplineFilterValue}`);
            }
        }

        const results = await index.search('', {
            hitsPerPage: 20,
            aroundLatLng: `${lat},${lng}`,
            aroundRadius: 5000000, 
            filters: filters.join(' AND ')
        });

        console.log("Algolia Search Results:", results);
        return results.hits;
    }

    /**
     * Display search results on Mapbox
     */
    async function displayMapWithResults() {
        console.log("Displaying Map with Results...");

        const userLocation = await getLocation();

        mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
            center: [userLocation.lng, userLocation.lat],
            zoom: 10
        });

        try {
            const results = await fetchAlgoliaResults(userLocation.lat, userLocation.lng);

            results.forEach(result => {
                if (result._geoloc && typeof result._geoloc.lng === 'number' && typeof result._geoloc.lat === 'number') {
                    const popupContent = `
                        <div>
                            <h4>${result.Name}</h4>
                            <p>${result.Description}</p>
                            <p><strong>Discipline:</strong> ${result.Disciplines || 'N/A'}</p>
                            <p><strong>State/Province:</strong> ${result.State_Province}</p>
                            <a href="/races/${result.Slug}">More details</a>
                        </div>
                    `;

                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

                    let discipline = result.Disciplines ? result.Disciplines.toLowerCase() : 'default';
                    let disciplineMarkers = {
                        'swimming': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833f1995f2e23c39eacc_swimming-icon-50.svg',
                        'paddling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d28340c9aa33055043be71_paddling-icon-50.svg',
                        'running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833f7badb96d1c86df8b_running-icon-50.svg',
                        'cycling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833fff1d33088ebee8f4_cycling-icon-50.svg'
                    };
                    let markerImageUrl = disciplineMarkers[discipline] || 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64ce497c38241ed462982298_favicon32.jpg';

                    const customMarker = new Image(50, 50);
                    customMarker.src = markerImageUrl;

                    new mapboxgl.Marker(customMarker)
                        .setLngLat([result._geoloc.lng, result._geoloc.lat])
                        .setPopup(popup)
                        .addTo(map);
                }
            });

        } catch (error) {
            console.error("Error fetching Algolia results:", error);
        }
    }

    /**
     * Event listener for the form submission to prevent page refresh and trigger map results display
     */
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('filterForm').addEventListener('submit', function(event) {
            console.log("Filter Form Submitted...");
            event.preventDefault();
            displayMapWithResults();
        });
    });

    /**
     * Event listener to adjust the checkbox styling based on its state
     */
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Adjusting Checkbox Styling...");

        function updateCheckboxStyling() {
            const spanElement = this.nextElementSibling;
            const parentLabel = spanElement.closest(".w-checkbox.checkbox-buttons");
            if (this.checked) {
                parentLabel.classList.add("active-filter");
            } else {
                parentLabel.classList.remove("active-filter");
            }
        }

        const checkboxes = document.querySelectorAll(".w-checkbox.checkbox-buttons input[type='checkbox']");
        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener("change", updateCheckboxStyling);
            updateCheckboxStyling.call(checkbox);
        });
    });

    // Kick-start the process by displaying the map with results
    displayMapWithResults();
</script>
