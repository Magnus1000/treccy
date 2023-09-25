// Function to update form fields based on URL parameters
const updateFormFieldsFromURL = () => {
    // Fetch the current URL and its query parameters
    const urlParams = new URLSearchParams(window.location.search);
  
    // Update sport checkboxes based on 'sport' URL params
    urlParams.forEach((value, key) => {
        if (key.startsWith('sport')) {
            const checkbox = document.querySelector(`.sport-checkbox[filter-value="${value}"]`);
            checkbox.checked = true;
            const parentWrapper = checkbox.closest('.sport-checkbox-button');
            parentWrapper.classList.add('selected');
        }
    });
  
    // Helper function to set an element's value by its ID
    const setElementValue = (id, value) => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.value = value;
      }
    };
  
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
  
    for (const [key, value] of urlParams.entries()) {
      const updateField = fieldMappings[key];
      if (updateField) {
        updateField(value);
      }
    }
  
    console.log("Form fields updated based on URL parameters.");
  };
  