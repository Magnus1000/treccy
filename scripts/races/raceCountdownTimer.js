// Function to update the countdown timer
function updateCountdown() {
    // Retrieve the date from the custom attribute "race-time-date"
    const raceTimeDate = new Date(document.querySelector('[race-time-date]').getAttribute('race-time-date'));

    // Get the current date
    const now = new Date();

    // Compute the difference between the current date and the race date
    const diff = raceTimeDate - now;

    // Check if the date has passed
    if (diff <= 0) {
      clearInterval(interval); // Stop the interval if the date has passed
      console.log("The race time date has passed!");
      return;
    }

    // Calculate years, months, days, hours, minutes, and seconds
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Function to update individual countdown div
    function updateDiv(id, newValue) {
      const div = document.querySelector(`${id} div`);
      if (div.textContent !== newValue.toString()) {
        div.textContent = newValue;
        div.parentElement.classList.add('updated');
      } else {
        div.parentElement.classList.remove('updated');
      }
    }

    // Update the divs using the id attributes
    updateDiv('#countdown-months', months);
    updateDiv('#countdown-days', days);
    updateDiv('#countdown-hours', hours);
    updateDiv('#countdown-minutes', minutes);
    updateDiv('#countdown-seconds', seconds);

    console.log("Countdown updated!");
}

// Call the updateCountdown function every second
const interval = setInterval(updateCountdown, 1000);

// Initial call to start the countdown immediately
updateCountdown();
