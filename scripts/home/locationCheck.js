<script>
  // Listen for the DOM content to be loaded
  document.addEventListener("DOMContentLoaded", function() {
    const locationButton = document.getElementById("location-button");
    locationButton.addEventListener("click", getLocationAndPopulateField);
  });

  // Function to handle location fetching and Mapbox integration
  function getLocationAndPopulateField() {
    // Change placeholder text and toggle icons
    const searchBar = document.getElementById("location-search-bar");
    searchBar.placeholder = "Fetching your location";
    document.getElementById("location-arrow-icon").style.display = "none";
    document.getElementById("loading-spinner").style.display = "flex";
    console.log("Started fetching location...");

    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      // Fetch the location
      navigator.geolocation.getCurrentPosition(async function(position) {
        // Get latitude and longitude
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        // Fetch location information using Mapbox
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`;
        const response = await fetch(url);
        const data = await response.json();
        let city = "";
        let region = "";

        // Loop through features to get the city and region
        for (const feature of data.features) {
          if (feature.place_type.includes('place')) {
            city = feature.text;
          }
          if (feature.place_type.includes('region')) {
            region = feature.text;
          }
        }

        // Prepare the text to be displayed
        const place = `${city}, ${region}`;
        console.log("Place:", place);

        // Populate the field with the fetched location
        searchBar.value = place;
        searchBar.placeholder = "Enter location";  // Reset placeholder
        // Reset the icons
        document.getElementById("location-arrow-icon").style.display = "flex";
        document.getElementById("loading-spinner").style.display = "none";

      }, function(error) {
        console.log("Error occurred:", error);
        // Reset the icons and placeholder in case of error
        searchBar.placeholder = "Enter location";
        document.getElementById("location-arrow-icon").style.display = "flex";
        document.getElementById("loading-spinner").style.display = "none";
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
</script>
