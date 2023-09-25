async function setupSearchSuggestions() {
  const searchInput = document.getElementById('location-search-bar');
  const suggestionsBox = document.getElementById('location-suggestions');

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
    console.log("Input event triggered.");
    const query = e.target.value.trim();

    if (query === "") {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove('active');
      suggestionsBox.style.display = "none";
      console.log("Query is empty, suggestions hidden.");
      return;
    }

    try {
      const response = await fetch(`https://treccy-serverside-magnus1000.vercel.app/api/mapBoxSearchSuggestionsMain?q=${query}`);
      const data = await response.json();

      console.log("Data received:", data);

      if (data.suggestions && data.suggestions.length > 0) {
        suggestionsBox.classList.add('active');
        suggestionsBox.style.display = "flex";
        suggestionsBox.innerHTML = "";

        const suggestions = data.suggestions;
        console.log(`Found ${suggestions.length} suggestions.`);

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
            const latitude = suggestion.coordinates[1];
            const longitude = suggestion.coordinates[0];
            const city = suggestion.city || '';
            const region = suggestion.region || '';

            searchInput.value = placeName;
            searchInput.setAttribute('data-lat', latitude);
            searchInput.setAttribute('data-lon', longitude);
            searchInput.setAttribute('data-region', region);
            searchInput.setAttribute('data-city', city);
            searchInput.setAttribute('data-country', suggestion.country || '');
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.remove('active');
            suggestionsBox.style.display = "none";

            console.log("Suggestion clicked and input filled.");
          });
        });
      } else {
        suggestionsBox.classList.remove('active');
        suggestionsBox.style.display = "none";
        console.log("No suggestions found.");
      }
    } catch (error) {
      console.error("Error:", error);
      suggestionsBox.classList.remove('active');
      suggestionsBox.style.display = "none";
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSearchSuggestions();
});