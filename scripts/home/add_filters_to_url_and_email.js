<script>

// Function to get element value by ID
(function() { // Start of IIFE
function getElementValue(id) {
  const elem = document.getElementById(id);
  return elem ? elem.value : null;
}

// Function to convert date string to Unix timestamp
function convertToUnix(dateStr) {
  const parts = dateStr.split(" ");
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const date = new Date(Date.UTC(parseInt("20" + parts[2]), months[parts[1]], parseInt(parts[0])));
  const unixTimestamp = date.getTime();
  console.log(`The Unix timestamp is ${unixTimestamp}`);
  return unixTimestamp;
}

// Function to get date range from the date picker input
function getDateRange() {
  const dateRange = document.getElementById('dateRange').value;
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
}

// Update URL params with filters
function updateURLWithFilters() {
  // Get discipline values from checked checkboxes
  const selectedDisciplines = Array.from(document.querySelectorAll('.disciplinefilter_checkbox'))
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.getAttribute('filter-value'));

  // Log the selected disciplines to the console
  console.log('Selected discipline filters:', selectedDisciplines);

 // Get the fromDate and toDate from the date picker
 const { fromDate, toDate } = getDateRange();

  // Filters collection
  const filters = {
    minDist: getElementValue('minimum-distance'),
    maxDist: getElementValue('maximum-distance'),
    locationRange: getElementValue('location_range'),
    fromDate,
    toDate,
    type: document.querySelector('input[name="type"]:checked')?.value,
    location: getElementValue('location-search-bar'),
    lat: document.getElementById('location-search-bar').getAttribute('data-lat'),
    lng: document.getElementById('location-search-bar').getAttribute('data-lon'),
  };

  let params = new URLSearchParams();

  // Add selected disciplines to URL parameters
  selectedDisciplines.forEach((discipline, index) => {
    params.append(`discipline${index}`, discipline);
  });

  // Add other filters to URL parameters
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  // Log the final parameters to the console
  console.log('Final URL parameters:', params.toString());

  // Update the URL without causing a page reload
  history.pushState({}, '', '?' + params.toString());
}

function showFilterForm() {
  const filterFormDiv = document.getElementById('filterForm');
  const filtersModalDiv = document.getElementById('filters-modal');
  
  if (filterFormDiv) {
    filterFormDiv.style.display = 'flex'; // Hide the entire filterForm div
  }

  if (filtersModalDiv) {
    filtersModalDiv.style.display = 'flex'; // Ensure that filters-modal div stays visible
  }
}

function hideFilterForm() {
  const filterFormDiv = document.getElementById('filterForm');
  const filtersModalDiv = document.getElementById('filters-modal');
  
  if (filterFormDiv) {
    filterFormDiv.style.display = 'none'; 
  }

  if (filtersModalDiv) {
    filtersModalDiv.style.display = 'flex'; 
  }
}

document.getElementById('filter-open').addEventListener('click', showFilterForm);
document.getElementById('filter-open-mobile').addEventListener('click', showFilterForm);
document.getElementById('filter-close').addEventListener('click', hideFilterForm);

//Add classes to Show and Hide Email Signup
function toggleEmailClasses() {
  // Get the div elements by class name
  const emailFieldDiv = document.getElementById('email-signup-field');
  const emailButtonTextDiv = document.getElementById('email-submit-button-text');
  const emailButtonDiv = document.getElementById('subscribe-to-notifications-button');

  // Check if the elements are found
  if (emailFieldDiv && emailButtonTextDiv) {
    // Toggle the active class for both divs
    emailFieldDiv.classList.toggle('active');
    emailButtonTextDiv.classList.toggle('active');
    emailButtonDiv.classList.toggle('active');
  } else {
    console.warn('Email elements not found');
  }
}

// Add an event listener to the form with id="filterForm"
document.getElementById('filterForm').addEventListener('submit', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

    // Call the function to hide the filter form div
    hideFilterForm();

    // Call the function to update URL with filters
    updateURLWithFilters();

    // Check if there are any URL parameters and load Algolia results
    checkAndLoadAlgoliaResults();
});

// Function to get the email from the form
function getEmail() {
  const emailElement = document.getElementById('email-signup-field');
  return emailElement ? emailElement.value : '';
}

// Function to validate email format
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Function to validate email in real-time
function checkEmailRealTime() {
  const emailElement = document.getElementById('email-signup-field');
  const feedbackElement = document.getElementById('email-feedback');
  if (!feedbackElement) {
    console.warn('Feedback element not found');
    return; // Exit if the feedback element is not found
  }
  if (isValidEmail(emailElement.value)) {
    feedbackElement.style.display = 'none';
  } else {
    feedbackElement.style.display = 'block';
    feedbackElement.textContent = 'Invalid email format';
  }
}

function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return params;
}


function sendWebhook(email, params) {
  // Check if the email is valid
  if (!isValidEmail(email)) {
    console.error('Invalid email:', email);
    return; // Exit the function if the email is not valid
  }

  // Get the current URL
  const signupPage = window.location.href;
  console.log(`The signup page URL is ${signupPage}`);

  // Construct the payload with email, parameters, and signupPage
  const payload = {
    email,
    params,
    signup_page: signupPage
  };

  // Webhook URL
  const url = 'https://hook.us1.make.com/chr1792n4xwbkd96ea3zhcdmnn9khntl';

  // Send a POST request to the webhook
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(response => response.text())
.then(data => {
  console.log('Webhook response:', data);
}); 
}


// Event listener for real-time email validation
document.getElementById('email-signup-field').addEventListener('input', checkEmailRealTime);

// Event listener for the button click
document.getElementById('subscribe-to-notifications-button').addEventListener('click', function() {
  const emailFieldDiv = document.getElementById('email-signup-field');
  const emailButtonDiv = document.getElementById('subscribe-to-notifications-button');

  // If email field is not active, or if it's active and empty, toggle the active state
  if (!emailFieldDiv.classList.contains('active') || (emailFieldDiv.classList.contains('active') && emailFieldDiv.value === '')) {
    // Toggle the active state if email field is not active or if it's active and empty
    toggleEmailClasses();
  } else {
    // Process the email if the field is active and not empty
    const email = getEmail();
    if (!isValidEmail(email)) {
      console.error('Invalid email:', email);
      return;
    }
    const params = getQueryParams(); // Assuming you have a getQueryParams function to get URL parameters
    console.log('Sending webhook with email:', email, 'and parameters:', params);
    sendWebhook(email, params);

    // Clear the email field
    document.getElementById('email-signup-field').value = '';

    // Call the function to toggle classes
    toggleEmailClasses();
  }
});
})();  // End of IIFE
</script>