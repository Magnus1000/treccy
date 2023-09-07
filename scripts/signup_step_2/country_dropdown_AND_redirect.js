<script>
const mapboxToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';
const searchInput = document.getElementById('location-search-bar');
const suggestionsBox = document.getElementById('suggestions');

// Attach event listener to search input
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query === "") {
        suggestionsBox.innerHTML = "";
        suggestionsBox.classList.remove('active'); // Hide suggestions
        suggestionsBox.style.display = "none"; // Hide using CSS
        return; // Exit if the query is empty
    }

    // Call the Mapbox Geocoding endpoint
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&types=place,region,country`)
        .then(response => response.json())
        .then(data => {
            // Check if features are available
            if (data.features && data.features.length > 0) {
                suggestionsBox.classList.add('active'); // Show suggestions
                suggestionsBox.style.display = "flex"; // Show using CSS
                suggestionsBox.innerHTML = "";

                const suggestions = data.features;
                suggestions.forEach(suggestion => {
                    // Create suggestion text
                    const placeName = suggestion.place_name;
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item'); // Assign class

                    // Create and add Font Awesome icon
                    const iconElement = document.createElement('i');
                    iconElement.className = 'fa-light fa-location-dot';
                    suggestionItem.appendChild(iconElement);

                    suggestionItem.appendChild(document.createTextNode(placeName));
                    suggestionsBox.appendChild(suggestionItem);

                    // Add click event listener to each suggestion
                    suggestionItem.addEventListener('click', () => {
                        // Populate the search bar with the selected suggestion
                        searchInput.value = placeName;
                        // Store latitude and longitude as attributes
                        searchInput.setAttribute('data-lat', suggestion.geometry.coordinates[1]);
                        searchInput.setAttribute('data-lon', suggestion.geometry.coordinates[0]);
                        // Clear the suggestions
                        suggestionsBox.innerHTML = "";
                        suggestionsBox.classList.remove('active'); // Hide suggestions
                        suggestionsBox.style.display = "none"; // Hide using CSS
                    });
                });
            } else {
                suggestionsBox.classList.remove('active'); // Hide suggestions
                suggestionsBox.style.display = "none"; // Hide using CSS
            }
        })
        .catch(error => console.error(error));
});

const button = document.getElementById("step-2-continue");
button.addEventListener("click", () => {
  window.location.href = "https://www.treccy.com/sign-up-step-3";
});

</script>
