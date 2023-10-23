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
  
// Call the function to set the link when the page loads
window.addEventListener('load', setLinkBasedOnRadioValue);

// Alternatively, you can call this function when any radio button changes
document.getElementById('radio-button-group').addEventListener('change', setLinkBasedOnRadioValue);