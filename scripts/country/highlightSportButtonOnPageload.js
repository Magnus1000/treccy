// Function to pre-check a radio button based on a custom attribute "radio-value"
function precheckRadioButton() {
  // Find all radio buttons in the document
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  // Loop through each radio button
  radioButtons.forEach((button) => {
    // Check if the radio button has a "radio-value" attribute set to "running"
    if (button.getAttribute('radio-value') === 'running') {
      // Pre-check the radio button
      button.checked = true;

      // Find the parent label
      const parentLabel = button.closest('label');
      if (parentLabel) {
        // Find the div with class "radio-button-tabs" within the parent label
        const targetDiv = parentLabel.querySelector('.radio-button-tabs');
        
        // Add the class to the target div
        if (targetDiv) {
          targetDiv.classList.add('w--redirected-checked');
        }
      }

      // Log the action to the console for debugging
      console.log('Radio button pre-checked and target div class added.');
    }
  });
}

function setLinkBasedOnRadioValue() {
    // Get all the radio buttons within the div with id="radio-button-group"
    const radioButtons = document.querySelectorAll('#radio-button-group input[type="radio"]');
  
    // Initialize an empty variable to hold the selected radio value
    let selectedRadioValue = '';
  
    // Loop through all radio buttons to find the one that is selected
    for (let i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        // If a radio button is selected, get its 'radio-value' attribute
        selectedRadioValue = radioButtons[i].getAttribute('radio-value');
        break; // Exit the loop once we find the selected radio button
      }
    }
  
    // If no radio button is selected, we log this to the console
    if (!selectedRadioValue) {
      console.log('No radio button selected');
      return; // Exit the function
    }
  
    // Log the selected radio value for debugging
    console.log('Selected Radio Value:', selectedRadioValue);
  
    // Generate the new URL
    const baseUrl = 'https://www.treccy.com';
    const newUrl = `${baseUrl}?sport0=${selectedRadioValue}`;
  
    // Log the new URL for debugging
    console.log('Generated URL:', newUrl);
  
    // Find the button with id="sports-see-more-button" and set its 'href' attribute
    const button = document.getElementById('sports-see-more-button');
    button.setAttribute('href', newUrl);
}

// Run the function to pre-check the radio button
window.addEventListener('DOMContentLoaded', (event) => {
  // Log to console that the DOM is fully loaded and parsed
  console.log('DOM fully loaded and parsed');

  // Call the function to pre-check the radio button
  precheckRadioButton();
});
  
// Call the function to set the link when the page loads
window.addEventListener('load', setLinkBasedOnRadioValue);

// Alternatively, you can call this function when any radio button changes
document.getElementById('radio-button-group').addEventListener('change', setLinkBasedOnRadioValue);