<!-- Function to handle page-scroll -->
<script>
// Variable to keep track of the current page
let currentPage = 0;

// Function to handle scroll event
function handleScroll() {
    // Check if user is at the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        // Increment current page
        currentPage++;

        // Fetch and display the next page of Algolia results
        const urlSearchParams = new URLSearchParams(window.location.search);
        const lat = parseFloat(urlSearchParams.get('lat'));
        const lng = parseFloat(urlSearchParams.get('lng'));
        const locationRange = parseFloat(urlSearchParams.get('locationRange'));
        
        loadAlgoliaResultsToDiv(lat, lng, locationRange, currentPage); // Pass the current page number
    }
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);
</script>

