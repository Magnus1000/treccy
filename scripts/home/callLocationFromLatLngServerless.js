// Function to handle location fetching and integration with Vercel function
async function getLocationAndPopulateField() {
    // Initialize UI elements
    const searchBar = document.getElementById("location-search-bar");
    searchBar.placeholder = "Fetching your location";
    document.getElementById("location-arrow-icon").style.display = "none";
    document.getElementById("loading-spinner").style.display = "flex";
    console.log("Started fetching location...");

    // Check for geolocation support
    if (navigator.geolocation) {
        // Fetch the location
        navigator.geolocation.getCurrentPosition(async function(position) {
            // Extract latitude and longitude
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            // Define the URL for the Vercel serverless function
            const vercelFunctionURL = "https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/fetchLocationFromLatLng.js";

            // Set request options for the serverless function
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude }),
            };

            // Make the fetch request to the Vercel function
            const response = await fetch(vercelFunctionURL, requestOptions);
            const data = await response.json();
            console.log("Received data from serverless function:", data);

            // Initialize city and region variables
            let city = "";
            let region = "";

            // Loop through features to identify the city and region
            for (const feature of data.features) {
                if (feature.place_type.includes('place')) {
                    city = feature.text;
                }
                if (feature.place_type.includes('region')) {
                    region = feature.text;
                }
            }

            // Concatenate city and region
            const location = `${city}, ${region}`;
            console.log("Location:", location);

            // Store location data in local storage
            const localStorageUserLocation = [latitude, longitude, location];
            localStorage.setItem('userLocation', JSON.stringify(localStorageUserLocation));

            // Add location data to URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('lat', latitude);
            urlParams.set('lng', longitude);
            urlParams.set('location', location);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, '', newUrl);

            // Populate the search bar with the location
            searchBar.value = location;

            // Reset UI elements
            searchBar.placeholder = "Enter location";
            document.getElementById("location-arrow-icon").style.display = "flex";
            document.getElementById("loading-spinner").style.display = "none";

        }, function(error) {
            // Handle errors and reset UI elements
            console.log("Error occurred:", error);
            searchBar.placeholder = "Enter location";
            document.getElementById("location-arrow-icon").style.display = "flex";
            document.getElementById("loading-spinner").style.display = "none";
        });
    } else {
        // Geolocation is not supported by this browser
        console.log("Geolocation is not supported by this browser.");
    }
}

// Listen for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", function () {
    const locationButton = document.getElementById("location-button");
    locationButton.addEventListener("click", getLocationAndPopulateField);
});