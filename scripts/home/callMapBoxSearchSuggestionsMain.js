// Function to setup search suggestions
async function setupSearchSuggestions() {
    const searchInput = document.getElementById(location-search-bar);
    const suggestionsBox = document.getElementById(location-suggestions);
  
    // Log to confirm elements have been found
    if (searchInput) {
      console.log("Search Input element found.");
    } else {
      console.log("Search Input element not found.");
    }
  
    if (suggestionsBox) {
      console.log("Suggestions Box element found.");
    } else {
      console.log("Suggestions Box element not found.");
    }
  
    searchInput.addEventListener('input', async (e) => {
      console.log("Input event triggered."); // Log when input event is triggered
      const query = e.target.value.trim();
  
      if (query === "") {
        suggestionsBox.innerHTML = "";
        suggestionsBox.classList.remove('active');
        suggestionsBox.style.display = "none";
        console.log("Query is empty, suggestions hidden."); // Log empty query case
        return;
      }
  
      try {
        const response = await fetch(`https://treccy-serverside-magnus1000.vercel.app/api/mapBoxSearchSuggestionsMain?q=${query}`);
        const data = await response.json();
        
        console.log("Data received:", data); // Log the data received
  
        if (data.suggestions && data.suggestions.length > 0) {
          suggestionsBox.classList.add('active');
          suggestionsBox.style.display = "flex";
          suggestionsBox.innerHTML = "";
  
          const suggestions = data.suggestions;
          console.log(`Found ${suggestions.length} suggestions.`); // Log number of suggestions found
  
          suggestions.forEach(suggestion => {
            const placeName = suggestion.place_name;
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('plugin-suggestion-item-83a1371d7');
  
            const iconElement = document.createElement('i');
            iconElement.className = 'fa-light fa-location-dot';
            suggestionItem.appendChild(iconElement);
  
            suggestionItem.appendChild(document.createTextNode(placeName));
            suggestionsBox.appendChild(suggestionItem);
  
            suggestionItem.addEventListener('click', () => {
              searchInput.value = placeName;
              searchInput.setAttribute('data-lat', suggestion.coordinates[1]);
              searchInput.setAttribute('data-lon', suggestion.coordinates[0]);
              searchInput.setAttribute('data-region', suggestion.region || '');
              searchInput.setAttribute('data-city', suggestion.city || '');
              searchInput.setAttribute('data-country', suggestion.country || '');
              suggestionsBox.innerHTML = "";
              suggestionsBox.classList.remove('active');
              suggestionsBox.style.display = "none";
              
              console.log("Suggestion clicked and input filled."); // Log when suggestion is clicked
            });
          });
        } else {
          suggestionsBox.classList.remove('active');
          suggestionsBox.style.display = "none";
          console.log("No suggestions found."); // Log when no suggestions are available
        }
      } catch (error) {
        console.error("Error:", error); // Log any errors
        suggestionsBox.classList.remove('active');
        suggestionsBox.style.display = "none";
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSearchSuggestions();
});