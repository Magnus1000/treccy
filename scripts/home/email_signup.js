<script>
  (function() { // Start of IIFE

    // Function to validate email format
    function isValidEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }

    // Function to toggle email classes (Show and Hide Email Signup)
    function toggleEmailClasses() {
      const emailFieldDiv = document.getElementById('email-signup-field');
      if (emailFieldDiv) {
        emailFieldDiv.classList.toggle('active');
      } else {
        console.warn('Email elements not found');
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
        toggleEmailClasses();
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
        toggleEmailClasses();
      }
    });

  })();  // End of IIFE
</script>

