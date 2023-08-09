<script>
console.log("Script Initiated");

// Function to get user's location
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

// Function to fetch results from Algolia based on user location and filters
async function fetchAlgoliaResults(lat, lng) {
    console.log("Fetching Algolia Results...");

    const filters = [];
    const appId = "CWUIX0EWFE";
    const apiKey = "4cd4c82105f395affbc472c07a9789c8";
    const searchClient = algoliasearch(appId, apiKey);
    const index = searchClient.initIndex('treccy_races_all');

    const disciplineFilterCheckbox = document.getElementById('disciplineFilter_checkbox');
    if (disciplineFilterCheckbox && disciplineFilterCheckbox.checked) {
        const filterValue = disciplineFilterCheckbox.getAttribute('filter-value');
        if (filterValue) {
            filters.push(`Disciplines=${filterValue}`); 
        }
    }

    console.log("Filters being sent to Algolia:", filters);
    
    // Construct the debug URL
    const debugURL = `https://${appId}-dsn.algolia.net/1/indexes/${'treccy_races_all'}/query?hitsPerPage=20&aroundLatLng=${lat},${lng}&aroundRadius=5000000&filters=${filters.join(' AND ')}`;
    console.log("Debug URL with parameters:", debugURL);

    const results = await index.search('', {
        hitsPerPage: 20,
        aroundLatLng: `${lat},${lng}`,
        aroundRadius: 5000000,
        filters: filters.join(' AND ')
    });

    console.log("Algolia Search Results:", results);
    return results.hits;
}

// Display on Mapbox
async function displayMapWithResults() {
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
            if(result._geoloc && typeof result._geoloc.lng === 'number' && typeof result._geoloc.lat === 'number') {
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

// Call the function to initiate the process
displayMapWithResults();

document.addEventListener("DOMContentLoaded", function() {
    // Adjusting Checkbox Styling on page load
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

    // Listening to filter form submission
    document.getElementById('filterForm').addEventListener('submit', function(event) {
        console.log("Filter Form Submitted...");

        event.preventDefault();
        displayMapWithResults();
    });

    // Display map with initial results
    displayMapWithResults();
});
</script>
