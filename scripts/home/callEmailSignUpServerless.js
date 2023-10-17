// Function to get the user token from local storage
function getUserToken() {
return localStorage.getItem('userToken');
}  

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

// Function to get URL parameters
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

// Function to send the webhook
function sendWebhook(email, params) {
  if (!isValidEmail(email)) {
    console.error('Invalid email:', email);
    return;
  }

  const signupPage = window.location.href;
  const payload = {
    email,
    params,
    signup_page: signupPage,
    user_token: getUserToken()
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
    if (data.includes('user_subscribed')) {
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

function updateUserSubscribed() {
  localStorage.setItem('userSubscribed', 'true');
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
