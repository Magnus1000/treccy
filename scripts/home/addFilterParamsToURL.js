'use strict';

// Function to get element value by ID
const getElementValue = id => {
  const elem = document.getElementById(id);
  return elem?.value ?? null;
};

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
  const selectedSports = Array.from(document.querySelectorAll('.sport-checkbox:checked'))
    .map(checkbox => checkbox.getAttribute('filter-value'));

  // Log the selected sports to the console
  console.log('Selected sports filters:', selectedSports);

  // Get the fromDate and toDate from the date picker
  const { fromDate, toDate } = getDateRange();

  // Filters collection
  const filters = {
    minDist: getElementValue('minimum-distance'),
    maxDist: getElementValue('maximum-distance'),
    radius: getElementValue('location-radius'),
    fromDate,
    toDate,
    lat: document.getElementById('location-search-bar')?.getAttribute('data-lat') ?? '',
    lng: document.getElementById('location-search-bar')?.getAttribute('data-lon') ?? '',
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

// Function to push form values to divs
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

document.getElementById('filter-open').addEventListener('click', showFilterForm);
document.getElementById('filter-open-mobile').addEventListener('click', showFilterForm);
document.getElementById('location-div-left').addEventListener('click', showFilterForm);
document.getElementById('filter-close').addEventListener('click', hideFilterForm);

// Add an event listener to the form with id="filter-form"
document.getElementById('filter-form').addEventListener('submit', event => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Call the function to hide the filter form div
  hideFilterForm();

  // Call the function to update URL with filters
  updateURLWithFilters();
  
  // Call the function to push form values to divs
  pushValuesToDivs();
});