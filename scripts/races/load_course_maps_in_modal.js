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
      console.log("Original 3D coordinates:", coord3D);
      const coord2D = [coord3D[0], coord3D[1]];
      console.log("Converted 2D coordinates:", coord2D);
      return coord2D;
    }

    // Check if the GeoJSON data is already stored in localStorage
    const storedGeoJSON = localStorage.getItem(AIRTABLE_RECORD_ID);
    if (storedGeoJSON) {
      console.log("Using stored GeoJSON data");
      return Promise.resolve(JSON.parse(storedGeoJSON));
    }

    // Fetch GeoJSON from Airtable based on the record ID
    return fetch(API_URL, {
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
      localStorage.setItem(AIRTABLE_RECORD_ID, JSON.stringify(geojsonData));
      
      // Locate the appropriate div where the map should be loaded
      const mapDiv = document.querySelector(`div[map-data-item="${AIRTABLE_RECORD_ID}"]`);
      if (!mapDiv) {
        console.error(`No div found with map-data-item="${AIRTABLE_RECORD_ID}"`);
        return;
      }
      
      // Initialize Mapbox here to avoid flashing
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';
      const firstSetOfCoords = geojsonData.features[0].geometry.coordinates[0];
      console.log("First set of 3D coordinates:", firstSetOfCoords);

      const firstCoord3D = firstSetOfCoords[0];
      console.log("First 3D coordinate from the set:", firstCoord3D);

      const firstCoord2D = convertTo2DCoordinates(firstCoord3D);
      console.log("First 2D coordinate:", firstCoord2D);

      const map = new mapboxgl.Map({
        container: mapDiv,
        style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
        center: firstCoord2D,
        zoom: 12
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
            'line-color': '#FF6201',
            'line-width': 2,
            'line-gap-width': 2
          }
        });
      });
    })
    .catch(error => {
      console.error("There was a problem:", error);
    });
  }

  // Function to show modal based on data-item attribute
  function showCourseMapModal(event) {
    const itemID = event.target.getAttribute('data-item');
    const modal = document.getElementById(itemID);
    modal.style.display = 'flex';
    console.log(`Showing modal with ID: ${itemID}`);
  }

  // Add event listeners to all buttons with the class 'button-outline-small' to open modals
  document.querySelectorAll('.button-outline-small').forEach(button => {
    button.addEventListener('click', function(event) {
      const airtableRecordId = event.target.getAttribute('data-at-id');
      console.log(`Using Airtable record ID: ${airtableRecordId}`);

      showCourseMapModal(event);
      loadCourseMap(airtableRecordId);
    });
  });
</script>
