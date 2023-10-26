// Select the collection list element
const collectionList = document.querySelector('.region-races-collection-list');

// Initialize a variable to hold the count of displayed items
let displayedCount = 0;

// Create a new MutationObserver instance
const observer = new MutationObserver(function(mutations) {
    // Loop through each mutation
    mutations.forEach(function(mutation) {
        // Check if the mutation is a childList mutation (i.e. items were added or removed from the list)
        if (mutation.type === 'childList') {
            // Get all items in the collection list (assuming they have a class 'collection-item')
            const items = collectionList.querySelectorAll('.region-races-item');

            // Reset the displayed count to 0
            displayedCount = 0;

            // Loop through each item and check if it's displayed
            items.forEach(item => {
                // Checking if the item's computed style is not 'none'
                if (window.getComputedStyle(item).display !== 'none') {
                    displayedCount++;
                }
            });

            console.log(`Number of displayed items: ${displayedCount}`); // Logging the count to console for debugging

            // Get the 'no-results-div' element by its ID
            const noResultsDiv = document.getElementById('no-results-div');

            // If no items are displayed, show the 'no-results-div'; otherwise, hide it
            if (displayedCount === 0) {
                noResultsDiv.style.display = 'flex';
                console.log('No results div displayed');
            } else {
                noResultsDiv.style.display = 'none';
                console.log('No results div hidden');
            }
        }
    });
});

// Configure the observer to watch for changes to the child nodes of the collection list
const observerConfig = { childList: true };
observer.observe(collectionList, observerConfig);