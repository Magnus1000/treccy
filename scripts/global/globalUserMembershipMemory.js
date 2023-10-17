//Load UUID library from a CDN
<script src="https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuid.min.js"></script>

// Function to save user token to local storage
function saveTokenToLocalStorage(token) {
    const existingToken = localStorage.getItem('userToken');
    if (existingToken) {
        console.log("User token already exists in local storage");
        return;
    }
    // Generate a new token using UUID
    const newToken = generateUserToken();
    console.log("Generated new token: ", newToken);
    localStorage.setItem('userToken', token);
    console.log("Token has been saved to local storage");
}

// Function to generate a user token
function generateUserToken() {
    return uuid.v4();
}  

// Function to find approximate address based on IP address
async function getUserLocation() {
    // Check if user location is stored in local storage
    const userLocation = JSON.parse(localStorage.getItem('userLocation'));
    if (userLocation) {
        const [lat, lng, [city, region, country]] = userLocation;
        return { lat, lng, city, region };
    }

    // If user location is not stored in local storage, fetch it from IP address
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const { latitude, longitude, city, region } = data;
    const location = `${city}, ${region}`;
    const userLocationArray = [latitude, longitude, [city, region, data.country_name]];
    localStorage.setItem('userLocation', JSON.stringify(userLocationArray));
    return { lat: latitude, lng: longitude, city, region };
}

