<script>
  (function() { // Start of IIFE

    // Function to copy the current URL to the clipboard
    function copyURLToClipboard() {
      const tempInput = document.createElement('input');
      document.body.appendChild(tempInput);
      tempInput.value = window.location.href;
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      console.log('Copied URL to clipboard:', window.location.href);
    }

    // Function to show and fade out the share success notification
    function showAndFadeOutShareSuccessNotification() {
      const successDiv = document.getElementById('success-notification-share');
      if (!successDiv) {
        console.warn('Share success notification div not found');
        return;
      }

      // Show the success div
      successDiv.style.opacity = '1';
      successDiv.style.display = 'flex';
      console.log('Displayed the share success notification');

      // Fade out after 3 seconds
      setTimeout(function() {
        let opacity = 1;

        const fadeEffect = setInterval(function() {
          if (opacity <= 0.1) {
            clearInterval(fadeEffect);
            successDiv.style.display = 'none';
            console.log('Faded out the share success notification');
          }
          successDiv.style.opacity = opacity;
          opacity -= 0.1;
        }, 50);
      }, 3000);
    }

    // Event listener for the share icon button
    document.getElementById('share-icon-div').addEventListener('click', function() {
      // Copy the URL to clipboard
      copyURLToClipboard();

      // Show and fade out the share success notification
      showAndFadeOutShareSuccessNotification();
    });

  })();  // End of IIFE
</script>
