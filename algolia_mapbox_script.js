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

// ... [rest of the script remains unchanged] ...

function createMarkerOnMap(map, result) {
    let markerImageUrl = disciplineMarkers['default'];  // set default marker

    if (result.Disciplines && disciplineMarkers[result.Disciplines.toLowerCase()]) {
        markerImageUrl = disciplineMarkers[result.Disciplines.toLowerCase()];
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div>
            <h4>${result.Name}</h4>
            <p>${result.Description}</p>
            <p><strong>Discipline:</strong> ${result.Disciplines || 'N/A'}</p>
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
        zoom: 10
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
