<script>
  // Initialize your specific Airtable and API information
  const API_KEY = "keyEiGPuqmRTtXcZ0";
  const BASE_ID = "app1buEm2yEqxilPh";
  const TABLE_NAME = "tblFeROOPk4T3fLyr";
  const FIELD_NAME = "course_map_geojson_at";
  
  // This should be dynamically fetched from Webflow CMS
  const AIRTABLE_RECORD_ID = "your_fetched_airtable_record_id_here";

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
    // Initialize Mapbox
    mapboxgl.accessToken = 'your_mapbox_access_token_here';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
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
    });

    // Your logic to display the modal goes here.
  })
  .catch(error => {
    console.error("There was a problem:", error);
  });
</script>
