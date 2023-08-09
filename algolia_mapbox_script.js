<script>
console.log("Script Initiated");

let currentMarkers = [];
const mapboxToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';
const algoliaConfig = {
    appId: "CWUIX0EWFE",
    apiKey: "4cd4c82105f395affbc472c07a9789c8",
    indexName: 'treccy_races_all'
};
const disciplineMarkers = {
    'swimming': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833f1995f2e23c39eacc_swimming-icon-50.svg',
    'paddling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d28340c9aa33055043be71_paddling-icon-50.svg',
    'running': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833f7badb96d1c86df8b_running-icon-50.svg',
    'cycling': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d2833fff1d33088ebee8f4_cycling-icon-50.svg',
    'default': 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64ce497c38241ed462982298_favicon32.jpg'
};

async function getLocation() {
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

async function fetchAlgoliaResults(lat, lng) {
    console.log("Fetching Algolia Results...");

    const filters = [];
    const searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
    const index = searchClient.initIndex(algoliaConfig.indexName);

    const disciplineFilterCheckbox = document.getElementById('disciplineFilter_checkbox');
    if (disciplineFilterCheckbox && disciplineFilterCheckbox.checked) {
        const filterValue = disciplineFilterCheckbox.getAttribute('filter-value');
        if (filterValue) {
            filters.push(`Disciplines=${filterValue}`);
        }
    }

    console.log("Filters being sent to Algolia:", filters);
    
    const debugURL = `https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes/${algoliaConfig.indexName}/query?hitsPerPage=20&aroundLatLng=${lat},${lng}&aroundRadius=5000000&filters=${filters.join(' AND ')}`;
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

function removeExistingMarkers() {
    for (const marker of currentMarkers) {
        marker.remove();
    }
    currentMarkers = [];
}

function createMarkerOnMap(map, result) {
    let markerImageUrl;
    if (result.Disciplines.length === 1) {
        markerImageUrl = disciplineMarkers[result.Disciplines[0].toLowerCase()];
    } else {
        // Use a generic marker for multiple disciplines
        markerImageUrl = 'https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64ce497c38241ed462982298_favicon32.jpg';
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div>
            <h4>${result.Name}</h4>
            <p>${result.Description}</p>
            <p><strong>Discipline:</strong> ${result.Disciplines.join(', ')}</p>
            <p><strong>State/Province:</strong> ${result.State_Province}</p>
            <a href="/races/${result.Slug}">More details</a>
        </div>
    `);

    const customMarker = new Image(50, 50);
    customMarker.src = markerImageUrl;

    const marker = new mapboxgl.Marker(customMarker)
        .setLngLat([result._geoloc.lng, result._geoloc.lat])
        .setPopup(popup)
        .addTo(map);

    currentMarkers.push(marker);
}


async function displayMapWithResults() {
    console.log("Displaying Map with Results...");
    const userLocation = await getLocation();

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
        center: [userLocation.lng, userLocation.lat],
        zoom: 10,
        accessToken: mapboxToken  // Add this line
    });

    const results = await fetchAlgoliaResults(userLocation.lat, userLocation.lng);
    removeExistingMarkers();
    results.forEach(result => {
        if (result._geoloc) {
            createMarkerOnMap(map, result);
        }
    });
}

function initializeCheckboxStyling() {
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
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateCheckboxStyling);
        updateCheckboxStyling.call(checkbox);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initializeCheckboxStyling();

    document.getElementById('filterForm').addEventListener('submit', (event) => {
        console.log("Filter Form Submitted...");
        event.preventDefault();
        displayMapWithResults();
    });

    displayMapWithResults();
});

</script>
