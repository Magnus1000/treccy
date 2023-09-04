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
    console.log("Fetched GeoJSON Data:", geojsonData); // Debugging line

    // Initialize Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';
    const map = new mapboxgl.Map({
      container: 'mapbox-course-map',
      style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv'
    });

    // Add GeoJSON data to the map
    map.on('load', function() {
      // All your existing code for adding the line and markers
    });
  })
  .catch(error => {
    console.error("There was a problem:", error);
  });
</script>
