// Define an asynchronous function to set up the search suggestions feature
async function setupSearchSuggestions() {
  // Get references to the search input and suggestions box elements
  const searchInput = document.getElementById('location-search-bar');
  const suggestionsBox = document.getElementById('location-suggestions');

  // Check if the search input element exists
  if (searchInput) {
    console.log("Search Input element found.");
  } else {
    console.log("Search Input element not found.");
  }

  // Check if the suggestions box element exists
  if (suggestionsBox) {
    console.log("Suggestions Box element found.");
  } else {
    console.log("Suggestions Box element not found.");
  }

  // Add an event listener to the search input for input events
  searchInput.addEventListener('input', async (e) => {
    console.log("Input event triggered.");
    // Get the search query from the input value
    const query = e.target.value.trim();

    // If the query is empty, hide the suggestions box and return
    if (query === "") {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove('active');
      suggestionsBox.style.display = "none";
      console.log("Query is empty, suggestions hidden.");
      return;
    }

    try {
      // Send a request to the server to get search suggestions for the query
      const response = await fetch(`https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/mapBoxSearchSuggestionsMain?q=${query}`); //The query is what the user types in the search bar
      const data = await response.json();

      // If there are suggestions, display them in the suggestions box
      if (data.suggestions && data.suggestions.length > 0) {
        suggestionsBox.classList.add('active');
        suggestionsBox.style.display = "flex";
        suggestionsBox.innerHTML = "";

        const suggestions = data.suggestions;
        console.log(`Found ${suggestions.length} suggestions.`);

        // Create a suggestion item for each suggestion and add it to the suggestions box
        suggestions.forEach(suggestion => {
          const placeName = suggestion.place_name;
          const suggestionItem = document.createElement('div');
          suggestionItem.classList.add('plugin-suggestion-item-83a1371d7');

          const iconElement = document.createElement('i');
          iconElement.className = 'fa-light fa-location-dot';
          suggestionItem.appendChild(iconElement);

          suggestionItem.appendChild(document.createTextNode(placeName));
          suggestionsBox.appendChild(suggestionItem);

          // Add a click event listener to the suggestion item to fill the search input with the suggestion and its data
          suggestionItem.addEventListener('click', () => {
            const latitude = suggestion.coordinates[1];
            const longitude = suggestion.coordinates[0];
            const placeName = suggestion.place_name || '';

            // Fill the search input with the suggestion and its data
            searchInput.value = placeName;
            searchInput.setAttribute('data-lat', latitude);
            searchInput.setAttribute('data-lon', longitude);
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.remove('active');
            suggestionsBox.style.display = "none";

            console.log("Suggestion clicked and input filled.");
            console.log("Attributes set:", searchInput.attributes);
          });
        });
      } else {
        // If there are no suggestions, hide the suggestions box
        suggestionsBox.classList.remove('active');
        suggestionsBox.style.display = "none";
        console.log("No suggestions found.");
      }
    } catch (error) {
      // If there is an error, hide the suggestions box
      console.error("Error:", error);
      suggestionsBox.classList.remove('active');
      suggestionsBox.style.display = "none";
    }
  });
}

// Add a DOMContentLoaded event listener to set up the search suggestions when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupSearchSuggestions();
});