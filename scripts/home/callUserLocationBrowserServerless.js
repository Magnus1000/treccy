// Log the initiation of the script
console.log("callUserLocationBrowserServerless.js script initiated");

// Function to handle location fetching and integration with Vercel function
async function getLocationAndPopulateField() {
// Initialize UI elements
const searchInput = document.getElementById("location-search-bar");
searchInput.placeholder = "Fetching your location...";
document.getElementById("location-arrow-icon").style.display = "none";
document.getElementById("loading-spinner").style.display = "flex";
console.log("Started fetching location...");

// Check for geolocation support
if (navigator.geolocation) {
    // Get the current position
    navigator.geolocation.getCurrentPosition(async function(position) {
        // Extract latitude and longitude
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        // Define the URL for the Vercel function
        const vercelFunctionURL = "https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/fetchUserLocationBrowser.js";

        // Make a POST request to the Vercel function
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
        };

        const response = await fetch(vercelFunctionURL, requestOptions);
        const data = await response.json();
        console.log("Received data:", data);

        // Initialize location variables
        let city = "";
        let region = "";

        // Loop through features to find city and region
        for (const feature of data.features) {
            if (feature.place_type.includes('place')) {
                city = feature.text;
            }
            if (feature.place_type.includes('region')) {
                region = feature.text;
            }
        }

        // Update the search input with new data
        searchInput.setAttribute('data-lat', latitude);
        searchInput.setAttribute('data-lon', longitude);
        searchInput.setAttribute('source', 'location_permission');

        // Populate the search bar with the location
        const placeName = [city, region].join(', ');
        searchInput.value = placeName;

        // Reset UI elements
        searchInput.placeholder = "Enter location";
        document.getElementById("location-arrow-icon").style.display = "flex";
        document.getElementById("loading-spinner").style.display = "none";
    },
    function(error) {
        console.log("An error occurred:", error);
        // Reset UI elements
        searchInput.placeholder = "Enter location";
        document.getElementById("location-arrow-icon").style.display = "flex";
        document.getElementById("loading-spinner").style.display = "none";
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}
}