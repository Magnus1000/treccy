// Function to go back in the user's history
function goBack() {
window.history.back();
console.log("Back button was clicked.");
}

// Adding an event listener to the button with ID 'backButton'
document.getElementById("backButton").addEventListener("click", goBack);