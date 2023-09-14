console.log("Formatted date function loaded...");

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().substr(-2);
  const formattedDate = `${day} ${month} ${year}`;
  console.log("Formatted date:", formattedDate);
  return formattedDate;
}

// Function to initialize like buttons
function initLikeButtons() {
  const memberstack = window.$memberstackDom;
  let likeButtons = document.querySelectorAll('.like-button');
  
  console.log(`Found ${likeButtons.length} 'like-button' elements.`);
  
  likeButtons.forEach(likeButton => {
    // Your existing logic here
  });
  
  console.log('Successfully added event listeners to all like-buttons.');
}

// Initialize like buttons when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded. Initializing like-buttons.');
  initLikeButtons();
});

// Call this function whenever you load new content
function onNewContentAdded() {
  console.log('New content added. Reinitializing like-buttons.');
  initLikeButtons();
}
