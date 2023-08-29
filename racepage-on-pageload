<script>
document.addEventListener("DOMContentLoaded", function () {
  var coordinates = "{{wf {&quot;path&quot;:&quot;location-coordinates&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";
  var [latitude, longitude] = coordinates.split(",").map(Number);

  if (document.getElementById('race-page-map')) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFnbnVzMTk5MyIsImEiOiJjbGwyOHUxZTcyYTc1M2VwZDhzZGY3bG13In0._jM6tBke0CyM5_udTKGDOQ';

    var map = new mapboxgl.Map({
      container: 'race-page-map',
      style: 'mapbox://styles/magnus1993/cll28qk0n006a01pu7y9h0ouv',
      center: [longitude, latitude],
      zoom: 10
    });

    // Create a DOM element for the marker
    var el = document.createElement('div');
    el.style.backgroundImage = 'url(https://uploads-ssl.webflow.com/64ccebfb87c59cf5f3e54ed9/64d94645e5135a6a8205a037_map-marker-orange.svg)';
    el.style.width = '50px'; // You can set the size as needed
    el.style.height = '50px';
    el.style.backgroundSize = 'cover';

    // Create the marker using the custom element
    new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map);
  } else {
    console.log('Error: Element with ID "race-page-map" not found.');
  }
});

</script>
