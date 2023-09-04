<script>
  // Function to display modal and load Mapbox and Airtable data
  function loadCourseMap(AIRTABLE_RECORD_ID) {
  // Initialize your specific Airtable and API information
  const API_KEY = "keyEiGPuqmRTtXcZ0";
  const BASE_ID = "app1buEm2yEqxilPh";
  const TABLE_NAME = "tblFeROOPk4T3fLyr";
  const FIELD_NAME = "course_map_geojson_at";

  // Construct the API URL for Airtable
  const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${AIRTABLE_RECORD_ID}`;

  // Function to convert 3D coordinates to 2D
  function convertTo2DCoordinates(coord3D) {
    console.log("Original 3D coordinates:", coord3D); // Log original 3D coordinates
    const coord2D = [coord3D[0], coord3D[1]]; // Take only the first two elements: longitude and latitude
    console.log("Converted 2D coordinates:", coord2D); // Log converted 2D coordinates
    return coord2D;
  }

  // Fetch GeoJSON from Airtable based on the record ID
  fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${API_KEY}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const fileUrl = data.fields[FIELD_NAME][0].url;
    console.log("GeoJSON File URL:", fileUrl);
    return fetch(fileUrl);
  })
  .then(response => response.json())
  .then(geojsonData => {
    console.log("Fetched GeoJSON Data:", geojsonData);

    if (!geojsonData.features || !geojsonData.features[0] || !geojsonData.features[0].geometry.coordinates) {
      console.error("Invalid GeoJSON data.");
      return;
    }

    // Initialize Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';
    const map = new mapboxgl.Map({
      container: 'mapbox-course-map',
      style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv'
    });

    map.on('load', function() {
      map.addSource('route', {
        type: 'geojson',
        data: geojsonData
      });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {},
        paint: {
          'line-color': '#888',
          'line-width': 8
        }
      });

      // Use only the first coordinate from the first set of 3D coordinates to center the map
      const firstSetOfCoords = geojsonData.features[0].geometry.coordinates[0];
      console.log("First set of 3D coordinates:", firstSetOfCoords);  // Log the first set of 3D coordinates

      if (firstSetOfCoords.length > 0) {
        const firstCoord3D = firstSetOfCoords[0];
        console.log("First 3D coordinate from the set:", firstCoord3D);  // Log the first 3D coordinate from the set

        const firstCoord2D = convertTo2DCoordinates(firstCoord3D);
        console.log("First 2D coordinate:", firstCoord2D);  // Log the first 2D coordinate

        try {
          map.setCenter(firstCoord2D);
        } catch (error) {
          console.error("Error setting center:", error);
        }
      }
      map.setZoom(12);  // Set an appropriate zoom level
    });
  })
  .catch(error => {
    console.error("There was a problem:", error);
  });
  }

  // Show Modal based on data-item attribute
  function showCourseMapModal(event) {
    const itemID = event.target.getAttribute('data-item');
    const modal = document.getElementById(itemID);
    modal.style.display = 'flex';
    console.log(`Showing modal with ID: ${itemID}`);
  }
  
  // Add event listeners to all buttons with the class 'button-outline-small' to open modals
  document.querySelectorAll('.button-outline-small').forEach(button => {
    button.addEventListener('click', function(event) {
      // Get the Airtable record ID from the button attribute
      const airtableRecordId = event.target.getAttribute('data-at-id');
      console.log(`Using Airtable record ID: ${airtableRecordId}`);  // Log the Airtable record ID for debugging

      showCourseMapModal(event);

      // Pass the Airtable record ID to loadCourseMap function
      loadCourseMap(airtableRecordId);
    });
  });
</script>
