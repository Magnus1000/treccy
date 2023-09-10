<script>
  (function() { // Start of IIFE

    // Function to validate email format
    function isValidEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }

    // Function to toggle "active" class for both email field and button text
function toggleEmailAndButtonClasses() {
  // Toggle class for email field
  const emailFieldDiv = document.getElementById('email-signup-field');
  if (emailFieldDiv) {
    emailFieldDiv.classList.toggle('active');
    console.log('Toggled active class on email signup field');
  } else {
    console.warn('Email signup field not found');
  }

  // Toggle class for email subscribe button text
  const emailButtonText = document.querySelector('.email-subscribe-button-text');
  if (emailButtonText) {
    emailButtonText.classList.toggle('active');
    console.log('Toggled active class on email subscribe button text');
  } else {
    console.warn('Email subscribe button text not found');
  }
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
        signup_page: signupPage
      };

      const url = 'https://hook.us1.make.com/chr1792n4xwbkd96ea3zhcdmnn9khntl';

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

        // Clear the email field
        document.getElementById('email-signup-field').value = '';
        toggleEmailAndButtonClasses();
      }
    });

  })();  // End of IIFE
</script>

