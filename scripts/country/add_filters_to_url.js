<script>
  // Function to get element value by ID
  function getElementValue(id) {
    const elem = document.getElementById(id);
    return elem ? elem.value : null;
  }

  // Function to update URL with filter information
  function updateURLWithFilters() {
    // Collect selected disciplines from checked checkboxes
    const selectedDisciplines = Array.from(document.querySelectorAll('.disciplinefilter_checkbox'))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.getAttribute('filter-value'));

    // Log the selected disciplines to the console for debugging
    console.log('Selected discipline filters:', selectedDisciplines);

    // Initialize URL parameters
    let params = new URLSearchParams();

    // Populate URL parameters with the selected disciplines
    selectedDisciplines.forEach((sport, index) => {
      params.append(`sport${index}`, sport);
    });

    // Log the final URL parameters for debugging
    console.log('Final URL parameters:', params.toString());

    // Update the URL without causing a page reload
    history.pushState({}, '', '?' + params.toString());
  }

  // Function to listen for changes on checkboxes with the class 'disciplinefilter_checkbox'
  function addCheckboxListeners() {
    // Find all checkboxes with the specified class
    const checkboxes = document.querySelectorAll('.disciplinefilter_checkbox');

    // Add an event listener to each checkbox
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        // Call the function to update the URL when a checkbox changes state
        updateURLWithFilters();
        // Check if there are any URL parameters and load Algolia results
        loadAlgoliaResultsToDiv();
      });
    });
  }

  // Add checkbox listeners when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    addCheckboxListeners();
  });

</script>
