// Log the initiation of the script
console.log("updateFormFieldsFromURL.js script initiated");

// Helper function to set an element's value by its ID
const setElementValue = (id, value) => {
    console.trace();
    const elem = document.getElementById(id);
    if (elem) {
        elem.value = value;
    }
};

// Function to update the form fields based on the URL params
const updateFormFieldsFromURL = (params) => {
    console.trace();
    // Check if params is undefined or null
    if (!params) {
      console.warn("Missing params argument in updateFormFieldsFromURL, extracting from URL again");
      params = extractURLParams();
    }
    let lat = params.lat;
    let lng = params.lng;
    let location = params.location;

    // If lat, lng, or location are not available in the URL params, check localStorage
    if (!lat || !lng || !location) {
      const localStorageUserLocation = JSON.parse(localStorage.getItem('userLocation'));
      if (localStorageUserLocation) {
        lat = lat || localStorageUserLocation[0];
        lng = lng || localStorageUserLocation[1];
        location = location || localStorageUserLocation[2];
      }
    }

    // Update sport checkboxes based on 'sport' URL params
    if (params.sports) {
      params.sports.forEach((value) => {
        const checkbox = document.querySelector(`.sport-checkbox[filter-value="${value}"]`);
        checkbox.checked = true;
        const parentWrapper = checkbox.closest('.sport-checkbox-button');
        parentWrapper.classList.add('selected');
      });
    }

    // Update other form fields based on the remaining URL params
    const fieldMappings = {
      minDist: value => setElementValue('minimum-distance', value / 1000),
      maxDist: value => setElementValue('maximum-distance', value / 1000),
      radius: value => setElementValue('location-radius', value),
      fromDate: value => {},
      toDate: value => {},
    };

    // Update lat, lng, and location form fields
    if (lat && lng && location) {
      const locationSearchBar = document.getElementById('location-search-bar');
      console.log(`Location search bar value set from ${lat && lng ? 'URL' : 'localStorage'}: ${location}`);
      if (locationSearchBar) {
        locationSearchBar.setAttribute('data-lat', lat);
        locationSearchBar.setAttribute('data-lon', lng);
        locationSearchBar.value = location; // Set the value of the location search bar
      }
    }

    // Update other form fields based on the remaining URL params
    for (const [key, value] of Object.entries(params)) {
      const updateField = fieldMappings[key];
      if (updateField) {
        updateField(value);
      }
    }
  };