// Helper function to set an element's value by its ID
const setElementValue = (id, value) => {
    const elem = document.getElementById(id);
    if (elem) {
        elem.value = value;
    }
};

// Function to update form fields based on URL parameters or localStorageUserLocation
const updateFormFieldsFromURL = () => {
    // Fetch the current URL and its query parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Check if lat, lng, city and region are available in the URL params
    let lat = urlParams.get('lat');
    let lng = urlParams.get('lng');
    let region = urlParams.get('region');
    let 

    // If lat, lng, or location are not available in the URL params, check localStorage
    if (!lat || !lng || !location) {
        const localStorageUserLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (localStorageUserLocation) {
            lat = lat || localStorageUserLocation[0];
            lng = lng || localStorageUserLocation[1];
            location = location || localStorageUserLocation[2]; // Access the third element of the array
        }
    }

    // Update sport checkboxes based on 'sport' URL params
    urlParams.forEach((value, key) => {
        if (key.startsWith('sport')) {
            const checkbox = document.querySelector(`.sport-checkbox[filter-value="${value}"]`);
            checkbox.checked = true;
            const parentWrapper = checkbox.closest('.sport-checkbox-button');
            parentWrapper.classList.add('selected');
        }
    });

    // Update other form fields based on the remaining URL params
    const fieldMappings = {
        minDist: value => setElementValue('minimum-distance', value / 1000),
        maxDist: value => setElementValue('maximum-distance', value / 1000),
        radius: value => setElementValue('location-radius', value),
        fromDate: value => {}, // Will handle this part later
        toDate: value => {}, // Will handle this part later
    };

    // Update lat, lng, and location form fields
    if (lat && lng && location) {
        const locationSearchBar = document.getElementById('location-search-bar');
        const locationValue = `${location}`;
        //setElementValue('latitude', lat);
        //setElementValue('longitude', lng);
        console.log(`Location search bar value set from ${lat && lng ? 'URL' : 'localStorage'}: ${locationValue}`);
        if (locationSearchBar) {
            locationSearchBar.setAttribute('data-lat', lat);
            locationSearchBar.setAttribute('data-lon', lng);
            locationSearchBar.value = locationValue; // Set the value of the location search bar to city, region
        }
    }

    // Update other form fields based on the remaining URL params
    for (const [key, value] of urlParams.entries()) {
        const updateField = fieldMappings[key];
        if (updateField) {
            updateField(value);
        }
    }
};