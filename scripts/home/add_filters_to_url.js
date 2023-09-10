<script>
  // Function to get element value by ID
  (function() { // Start of IIFE
    function getElementValue(id) {
      const elem = document.getElementById(id);
      return elem ? elem.value : null;
    }

    // Function to convert date string to Unix timestamp
    function convertToUnix(dateStr) {
      const parts = dateStr.split(" ");
      const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      const date = new Date(Date.UTC(parseInt("20" + parts[2]), months[parts[1]], parseInt(parts[0])));
      const unixTimestamp = date.getTime();
      console.log(`The Unix timestamp is ${unixTimestamp}`);
      return unixTimestamp;
    }

    // Function to get date range from the date picker input
    function getDateRange() {
      const dateRange = document.getElementById('dateRange').value;
      if (!dateRange) {
        return { fromDate: '', toDate: '' };
      }
      const [fromDateStr, toDateStr] = dateRange.split(' - ');

      // Convert the date strings to Unix timestamps
      const fromDate = convertToUnix(fromDateStr);
      const toDate = convertToUnix(toDateStr);

      // Log the date ranges to the console for debugging
      console.log(`The from date is ${fromDate} and the to date is ${toDate}`);

      return { fromDate, toDate };
    }

    // Update URL params with filters
    function updateURLWithFilters() {
      // Get sport values from checked checkboxes
      const selectedSports = Array.from(document.querySelectorAll('.disciplinefilter_checkbox'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.getAttribute('filter-value'));

      // Log the selected sports to the console
      console.log('Selected sports filters:', selectedSports);

      // Get the fromDate and toDate from the date picker
      const { fromDate, toDate } = getDateRange();

      // Filters collection
      const filters = {
        minDist: getElementValue('minimum-distance'),
        maxDist: getElementValue('maximum-distance'),
        locationRange: getElementValue('location_range'),
        fromDate,
        toDate,
        type: document.querySelector('input[name="type"]:checked')?.value,
        location: getElementValue('location-search-bar'),
        lat: document.getElementById('location-search-bar').getAttribute('data-lat'),
        lng: document.getElementById('location-search-bar').getAttribute('data-lon'),
      };

      let params = new URLSearchParams();

      // Add selected sportss to URL parameters
      selectedSports.forEach((sport, index) => {
        params.append(`sport${index}`, sport);
      });

      // Add other filters to URL parameters
      for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value);
      }

      // Log the final parameters to the console
      console.log('Final URL parameters:', params.toString());

      // Update the URL without causing a page reload
      history.pushState({}, '', '?' + params.toString());
    }

    function showFilterForm() {
      const filterFormDiv = document.getElementById('filterForm');
      const filtersModalDiv = document.getElementById('filters-modal');
      
      if (filterFormDiv) {
        filterFormDiv.style.display = 'flex'; // Show the entire filterForm div
      }

      if (filtersModalDiv) {
        filtersModalDiv.style.display = 'flex'; // Ensure that filters-modal div stays visible
      }
    }

    function hideFilterForm() {
      const filterFormDiv = document.getElementById('filterForm');
      const filtersModalDiv = document.getElementById('filters-modal');
      
      if (filterFormDiv) {
        filterFormDiv.style.display = 'none'; 
      }

      if (filtersModalDiv) {
        filtersModalDiv.style.display = 'flex'; 
      }
    }

    document.getElementById('filter-open').addEventListener('click', showFilterForm);
    document.getElementById('filter-open-mobile').addEventListener('click', showFilterForm);
    document.getElementById('filter-close').addEventListener('click', hideFilterForm);

    // Add an event listener to the form with id="filterForm"
    document.getElementById('filterForm').addEventListener('submit', function(event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Call the function to hide the filter form div
      hideFilterForm();

      // Call the function to update URL with filters
      updateURLWithFilters();
    });
  })();  // End of IIFE
</script>
