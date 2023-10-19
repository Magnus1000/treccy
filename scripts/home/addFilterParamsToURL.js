// Log the initiation of the script
console.log("addFilterParamsToURL.js script initiated");

// Function to convert date string to Unix timestamp
const convertToUnix = dateStr => {
  const [day, month, year] = dateStr.split(" ");
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const date = new Date(Date.UTC(parseInt("20" + year), months[month], parseInt(day)));
  const unixTimestamp = date.getTime();
  console.log(`The Unix timestamp is ${unixTimestamp}`);
  return unixTimestamp;
};

// Function to get date range from the date picker input
const getDateRange = () => {
  const dateRange = document.getElementById('dateRange')?.value ?? '';
  if (!dateRange) {
    return { fromDate: '', toDate: '' };
  }
  const [fromDateStr, toDateStr] = dateRange.split(' - ');

  // Convert the date strings to Unix timestamps
  const fromDate = convertToUnix(fromDateStr);
  const toDate = convertToUnix(toDateStr);

  // Log the date ranges to the console for debugging
  console.log(`The from date is ${fromDate} and the to date is ${toDate}`);

  return { fromDate, toDate };
};

// Update URL params with filters
const updateURLWithFilters = () => {
  // Get sport values from checked checkboxes
  console.trace();
  const selectedSports = Array.from(document.querySelectorAll('.sport-checkbox:checked'))
    .map(checkbox => checkbox.getAttribute('filter-value'));

  // Log the selected sports to the console
  console.log('Selected sports filters:', selectedSports);

  // Get the fromDate and toDate from the date picker
  const { fromDate, toDate } = getDateRange();

  // Get the lat, lng and location  values from the search bar
  const locationSearchBar = document.getElementById('location-search-bar');
  const lat = locationSearchBar?.getAttribute('data-lat') ?? '';
  const lng = locationSearchBar?.getAttribute('data-lon') ?? '';
  const source = locationSearchBar?.getAttribute('source') ?? '';
  const location = locationSearchBar?.value ?? '';
  console.log(`Location search bar values: ${lat}, ${lng}, ${location}`);

  // Function to get the value of an element by ID
  function getElementValue(id) {
    return document.getElementById(id).value;
  }

  // Filters collection
  const filters = {
    minDist: getElementValue('minimum-distance') * 1000,
    maxDist: getElementValue('maximum-distance') * 1000,
    radius: getElementValue('location-radius'),
    fromDate,
    toDate,
    location,
    lat,
    lng,
  };

  const params = new URLSearchParams();

  // Add selected sports to URL parameters
  selectedSports.forEach((sport, index) => {
    params.append(`sport${index}`, sport);
  });

  // Add other filters to URL parameters
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  // Log the final parameters to the console
  console.log('Final URL parameters:', params.toString());

  // Update the URL without causing a page reload
  history.pushState({}, '', '?' + params.toString());

  if (lat && lng && location) {
    // Store location data in local storage
    const localStorageUserLocation = [lat, lng, [location]];
    localStorage.setItem('userLocation', JSON.stringify(localStorageUserLocation));
    localStorage.setItem('locationSource', source);
    console.log(`Location data stored in local storage as ${localStorageUserLocation}`);
  }
};

// Function to show the filter form
const showFilterForm = () => {
  const filterFormDiv = document.getElementById('filter-form');
  const filtersModalDiv = document.getElementById('filters-modal');
  
  if (filterFormDiv) {
    filterFormDiv.style.display = 'flex'; // Show the entire filter-form div
  }

  if (filtersModalDiv) {
    filtersModalDiv.style.display = 'flex'; // Ensure that filters-modal div stays visible
  }
};

// Function to hide the filter form div
const hideFilterForm = () => {
  const filterFormDiv = document.getElementById('filter-form');
  const filtersModalDiv = document.getElementById('filters-modal');
  
  if (filterFormDiv) {
    filterFormDiv.style.display = 'none'; 
  }

  if (filtersModalDiv) {
    filtersModalDiv.style.display = 'flex'; 
  }
};

// Function to update location button on left with form values
const pushValuesToDivs = () => {
  // Get the element and value of the search input field with ID 'location-search-bar'
  const locationElement = document.getElementById('location-search-bar');
  const locationValue = locationElement?.value ?? null;

  // Get the element and value of the range dropdown with ID 'location_range'
  const rangeElement = document.getElementById('location-radius');
  const rangeValue = rangeElement ? parseInt(rangeElement.value) : null;

  // If the location field has a value, push it to the div with ID 'location-text'
  if (locationValue) {
    const locationTextDiv = document.getElementById('location-text');
    locationTextDiv.textContent = locationValue;
    console.log(`Pushed ${locationValue} to location-text div`);
  }

  // If the range field has a value, convert it to km, push it to the div with ID 'range-text'
  // and change its display property to 'flex'
  if (rangeValue) {
    const rangeTextDiv = document.getElementById('range-text');
    const rangeInKm = rangeValue / 1000; // Convert meters to km
    rangeTextDiv.textContent = `${rangeInKm}km`;

    const locationRangeTextDivs = document.querySelectorAll('.location-range-text');
    locationRangeTextDivs.forEach(div => div.style.display = 'flex');

    console.log(`Pushed ${rangeInKm}km to range-text div and set its display to flex`);
  }
};

// Set up search suggestions so its only called once
let searchSuggestionsSetUp = false;

document.getElementById('filter-open').addEventListener('click', function() {
  showFilterForm();
  if (!searchSuggestionsSetUp) {
    setupSearchSuggestions();
    searchSuggestionsSetUp = true; // Set searchSuggestionsSetUp to true so that the setupSearchSuggestions function is not called again
  }
});

document.getElementById('location-div-left').addEventListener('click', function() {
  showFilterForm();
  if (!searchSuggestionsSetUp) {
    setupSearchSuggestions();
    searchSuggestionsSetUp = true; // Set searchSuggestionsSetUp to true so that the setupSearchSuggestions function is not called again
  }
});

document.getElementById('filter-open-mobile').addEventListener('click', function() {
  showFilterForm();
  if (!searchSuggestionsSetUp) {
    setupSearchSuggestions();
    searchSuggestionsSetUp = true; // Set searchSuggestionsSetUp to true so that the setupSearchSuggestions function is not called again
  }
});
document.getElementById('filter-close').addEventListener('click', hideFilterForm);

// Declare a variable to store the URL before form submission
let previousURL = window.location.href;

// Add an event listener to the form with id="filter-form"
document.getElementById('filter-form').addEventListener('submit', event => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Call the function to update URL with filters
  updateURLWithFilters();

  // Call the function to hide the filter form div
  hideFilterForm();

  // Check if the URL has changed
  const currentURL = window.location.href;
  if (currentURL !== previousURL) {
    // Fetch new race results from the serverless function
    checkURLParams();
  }

  // Update the previousURL variable with the current URL
  previousURL = currentURL;

  // Call the function to push form values to divs
  pushValuesToDivs();
});

// Function to listen to sports checkboxes and toggle the 'selected' class
function toggleSelectedClass() {
  // Find all checkboxes with the class 'sport-checkbox'
  const checkboxes = document.querySelectorAll('.sport-checkbox');

  // Loop through each checkbox to attach an event listener
  checkboxes.forEach((checkbox) => {
    // Attach 'change' event listener to each checkbox
    checkbox.addEventListener('change', function() {
      // Log the current state to console for debugging
      console.log(`Checkbox with filter-value '${this.getAttribute('filter-value')}' is ${this.checked ? 'checked' : 'unchecked'}`);

      // Get the parent element wrapper
      const parentWrapper = this.closest('.sport-checkbox-button');
      
      if (this.checked) {
        // If the checkbox is checked, add the 'selected' class to its parent wrapper
        parentWrapper.classList.add('selected');
      } else {
        // If the checkbox is unchecked, remove the 'selected' class from its parent wrapper
        parentWrapper.classList.remove('selected');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', toggleSelectedClass); // Add event listener to toggle the 'selected' class on sports checkboxes