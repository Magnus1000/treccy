// Function to validate email format
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Function to get the email from the form
function getEmail() {
  const emailElement = document.getElementById('email-signup-field');
  return emailElement ? emailElement.value : '';
}

async function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  // Extract sports parameters and store them in an array
  const sports = [];
  let i = 0;
  while (params[`sport${i}`]) {
    sports.push(params[`sport${i}`]);
    delete params[`sport${i}`];
    i++;
  }
  params.sports = sports;
  // If lat, lng, city, or region are not available in the URL params, check localStorage
  if (!params.lat || !params.lng || !params.location) {
    const userLocationArray = await getUserLocation();
    [lat, lng, [location]] = userLocationArray;
    params.lat = lat;
    params.lng = lng;
    params.location = location;
  }
  return params;
}

// Function to send the webhook
async function sendWebhook(email) {
  if (!isValidEmail(email)) {
    console.error('Invalid email:', email);
    return;
  }

  const signupPage = window.location.href;
  const params = await getQueryParams(); // Awaiting the async function here
  console.log("Fetched params: ", params); // Log the fetched params

  const payload = {
    email,
    params,
    signup_page: signupPage,
    user_subscribed_status: getUserSubscribed(),
    user_token: checkUserToken(),
    location_source: getLocationSource()
  };

  const url = 'https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/emailSignUp.js';

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
    if (data.includes('user_subscribed_successfully')) {
      updateUserSubscribed();
      removeActiveClassFromEmailSignupLongWrapper();
    }
  });
}

// Event listener for the email submit button
document.getElementById('subscribe-to-notifications-button').addEventListener('click', function() {
  const emailFieldDiv = document.getElementById('email-signup-field');
  
  if (!emailFieldDiv.classList.contains('active') || (emailFieldDiv.classList.contains('active') && emailFieldDiv.value === '')) {
    toggleEmailAndButtonClasses();
  } else {
    const email = getEmail();
    if (!isValidEmail(email)) {
      console.error('Invalid email:', email);
      return;
    }

    const params = getQueryParams();
    console.log('Sending webhook with email:', email, 'and parameters:', params);
    sendWebhook(email, params);
    updateUserSubscribed();

    // Clear the email field
    document.getElementById('email-signup-field').value = '';
  }
});

function getUserSubscribed() {
  const userSubscribed = localStorage.getItem('userSubscribed');
  console.log('getUserSubscribed - userSubscribed:', userSubscribed);
  if (userSubscribed === null) {
    console.log('getUserSubscribed - returning false');
    return false;
  }
  console.log('getUserSubscribed - returning userSubscribed:', userSubscribed);
  return userSubscribed;
}


// Function to update the userSubscribed value in localStorage
function updateUserSubscribed() {
  localStorage.setItem('userSubscribed', 'true');
}

function getLocationSource() {
  return localStorage.getItem('locationSource');
}

function removeActiveClassFromEmailSignupLongWrapper() {
  const emailSignupLongWrapper = document.querySelector('.email-signup-long-wrapper');
  if (emailSignupLongWrapper) {
    emailSignupLongWrapper.classList.remove('active');
    console.log('Removed active class from email signup long wrapper');
  } else {
    console.warn('Email signup long wrapper not found');
  }
}

