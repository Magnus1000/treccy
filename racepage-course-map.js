<script>
  // Initialize your specific Airtable and API information
  const API_KEY = "keyEiGPuqmRTtXcZ0";
  const BASE_ID = "app1buEm2yEqxilPh";
  const TABLE_NAME = "tblFeROOPk4T3fLyr";
  const FIELD_NAME = "course_map_geojson_at";

  // This should be dynamically fetched from Webflow CMS
  const AIRTABLE_RECORD_ID = "{{wf {&quot;path&quot;:&quot;airtable-record-id-wf&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";

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

    // Fetch the actual GeoJSON file
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

    // Add GeoJSON data to the map
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

      // Convert the 3D coordinates to 2D
      const firstCoord = convertTo2DCoordinates(geojsonData.features[0].geometry.coordinates[0]);
      const lastCoord = convertTo2DCoordinates(geojsonData.features[0].geometry.coordinates[geojsonData.features[0].geometry.coordinates.length - 1]);

      // Define bounds based on these points
      const bounds = new mapboxgl.LngLatBounds(firstCoord, lastCoord);
      map.fitBounds(bounds, { padding: 20 });

      // Create a marker for the start point and add it to the map
      new mapboxgl.Marker({ color: 'green' }).setLngLat(firstCoord).addTo(map);

      // Create a marker for the end point and add it to the map
      new mapboxgl.Marker({ color: 'red' }).setLngLat(lastCoord).addTo(map);
    });
  })
  .catch(error => {
    console.error("There was a problem:", error);
  });
</script>
