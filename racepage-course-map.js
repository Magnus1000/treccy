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
    console.log("Fetched GeoJSON Data:", geojsonData);

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

      // Calculate bounds of the GeoJSON data
      const coordinates = geojsonData.features[0].geometry.coordinates;
      let bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      // Fit map to bounds
      map.fitBounds(bounds, {
        padding: 20
      });

      // Create a marker for the start point and add it to the map
      const startPoint = coordinates[0];
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(startPoint)
        .addTo(map);

      // Create a marker for the end point and add it to the map
      const endPoint = coordinates[coordinates.length - 1];
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(endPoint)
        .addTo(map);
    });
  })
  .catch(error => {
    console.error("There was a problem:", error);
  });
</script>
