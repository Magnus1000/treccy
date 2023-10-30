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

// Function to send the webhook
async function sendWebhook(email) {  // Marking function as async
  if (!isValidEmail(email)) {
    console.error('Invalid email:', email);
    emailSignupButton.disabled = false; // Enabling the button
    return;
  }
  const emailSignupButton = document.getElementById('subscribe-button');
  emailSignupButton.disabled = true; // Disabling the button

  const signupPage = window.location.href;
  let params = extractURLParams(); // Awaiting the async function here
  console.log("Fetched params: ", params); // Log the fetched params

  // Check if lat, lng and location exist in params
  if (!params.lat || !params.lng || !params.location) {
    // Call the getUserLocation function to get [lat, lng, location]
    const userLocation = await getUserLocation();
    params.lat = userLocation[0];
    params.lng = userLocation[1];
    params.location = userLocation[2];
  }

  // Awaiting the checkUserToken function here
  const userToken = await checkUserToken();

  const payload = {
    email,
    params,
    signup_page: signupPage,
    user_subscribed_status: getUserSubscribed(),
    user_token: userToken,
    location_source: getLocationSource()
  };

  console.log('Sending webhook with payload:', payload);
  
  const url = 'https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/emailSignUp.js';

  // Displaying a message until the webhook response is received
  const emailSignupField = document.getElementById('email-signup-field');
  emailSignupField.value = 'Carb-loading your details...';

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
    }
    // Removing the message from the input field after the webhook response is received
    emailSignupField.value = '';
    emailSignupButton.disabled = false; // Enabling the button
  });
}


// Event listener for the email submit button
document.getElementById('subscribe-button').addEventListener('click', function(event) {
  event.preventDefault(); 
  const emailFieldDiv = document.getElementById('email-signup-field');
  
  if (!emailFieldDiv.classList.contains('focused') || (emailFieldDiv.classList.contains('focused') && emailFieldDiv.value === '')) {
    applyFocusClass();
  } else {
    const email = getEmail();
    if (!isValidEmail(email)) {
      console.error('Invalid email:', email);
      return;
    }

    const params = extractURLParams();
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

// Function to toggle the focus class on the email header
function applyFocusClass() {
  const emailSignupLongHeader = document.querySelector('.email-signup-long-header');
  const emailExpandArrow = document.querySelector('.email-expand-arrow');
  const emailInputField = document.querySelector('.email-input-field');
  const emailInputDiv = document.querySelector('.email-input-div');
  const emailSignUpDiv = document.querySelector('.email-sign-up-div');
  if (emailSignupLongHeader) {
    emailSignupLongHeader.classList.add('focused');
    emailExpandArrow.classList.add('focused');
    emailInputField.classList.add('focused');
    emailInputDiv.classList.add('focused');
    emailSignUpDiv.classList.add('focused');
    console.log('Added focus class to email signup long header');
  } else {
    console.warn('Email signup long header not found');
  }
}

const emailSignupDiv = document.querySelector('.email-sign-up-div');
emailSignupDiv.addEventListener('click', function(event) {
  event.preventDefault();
  if (event.target.closest('.email-sign-up-div')) {
    applyFocusClass();
  }
});

// Function to show or hide the email signup div
function hideEmailDivsIfSubscribed() {
  const userSubscribed = getUserSubscribed();
  if (userSubscribed === false || userSubscribed === null) {
    const emailDivs = document.querySelectorAll('[data-email-div="true"]');
    emailDivs.forEach((div) => {
      div.style.display = 'flex';
    });
  }
}

// Call the function to hide the email divs if the user is subscribed
window.addEventListener('load', function() {
  hideEmailDivsIfSubscribed();
});

// Function to load the email success message in slices
function loadDivInSlices() {
  console.log("loadDivInSlices function called");

  const targetDiv = document.getElementById('divReveal');
  const hideDiv = document.getElementById('divHide');

  targetDiv.style.visibility = 'hidden'; // hide the target div
  targetDiv.style.display = 'flex';
  console.log("Target div display style updated to flex");

  const loadDirection = targetDiv.getAttribute('data-load-direction');
  const step = parseInt(targetDiv.getAttribute('data-step-count'), 10) || 10;
  const timeStep = parseInt(targetDiv.getAttribute('data-time-step'), 10) || 100; // get the time step from the data-time-step attribute

  // Function to set height dynamically
  const setHeight = (height) => {
      targetDiv.style.height = `${height}px`;
  };

  // Function to set width dynamically
  const setWidth = (width) => {
      targetDiv.style.width = `${width}px`;
  };

  if (loadDirection === 'vertical') {
      const finalHeight = hideDiv.offsetHeight;
      console.log("Hide div height selected:", finalHeight);
      loadInDirection('vertical', step, finalHeight, setHeight, timeStep); // pass the time step to the loadInDirection function
  } else {
      const finalWidth = hideDiv.offsetWidth;
      console.log("Hide div width selected:", finalWidth);
      loadInDirection('horizontal', step, finalWidth, setWidth, timeStep); // pass the time step to the loadInDirection function
  }

  setTimeout(() => {
      targetDiv.style.visibility = 'visible'; // show the target div after a 500ms pause
  }, 500);
}

// New function to handle loading based on direction and time step
function loadInDirection(direction, step, finalDimension, dimensionSetter, timeStep) {
  console.log(`Loading in ${direction} direction`);
  let currentDimension = 0;
  const interval = setInterval(() => {
      currentDimension += step;
      dimensionSetter(currentDimension);
      console.log(`Current ${direction} dimension: ${currentDimension}px`);

      if (currentDimension >= finalDimension) {
          clearInterval(interval);
          console.log(`Reached final ${direction} dimension`);
      }
  }, timeStep); // use the time step to set the interval
}