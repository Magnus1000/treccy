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

    // Check if lat, lng, and location are available in the URL params
    let lat = urlParams.get('lat');
    let lng = urlParams.get('lng');
    let location = urlParams.get('location');

    // If lat, lng, or location are not available in the URL params, check localStorage
    if (!lat || !lng || !location) {
        const localStorageUserLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (localStorageUserLocation) {
            lat = lat || localStorageUserLocation[0];
            lng = lng || localStorageUserLocation[1];
            location = location || localStorageUserLocation[2];
        }
    }

    // Log the source and value of the location search bar
    if (location) {
        console.log(`Location search bar value set from ${lat && lng ? 'URL' : 'localStorage'}: ${location}`); // Log to specify whether location was set from URL or localStorage
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
        location: value => setElementValue('location-search-bar', value),
        lat: value => document.getElementById('location-search-bar')?.setAttribute('data-lat', value),
        lng: value => document.getElementById('location-search-bar')?.setAttribute('data-lon', value),
    };

    // Update lat, lng, and location form fields
    if (lat) {
        setElementValue('latitude', lat);
    }
    if (lng) {
        setElementValue('longitude', lng);
    }
    if (location) {
        setElementValue('location-search-bar', location);
    }

    // Update other form fields based on the remaining URL params
    for (const [key, value] of urlParams.entries()) {
        const updateField = fieldMappings[key];
        if (updateField) {
            updateField(value);
        }
    }
};