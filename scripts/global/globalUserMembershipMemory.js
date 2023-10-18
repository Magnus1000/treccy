// Function to check and set a user token to local storage
function checkUserToken() {
    const existingToken = localStorage.getItem('userToken');
    if (existingToken) {
        console.log("User token already exists in local storage");
        return existingToken;
    }
    // Generate a new token using UUID
    const newToken = generateUserToken();
    console.log("Generated new token: ", newToken);
    localStorage.setItem('userToken', newToken);
    console.log("Token has been saved to local storage");
    return newToken;
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
      console.log(`Using lat:${lat} and lng:${lng} from localStorage`); // Log to specify whether location was set from URL, localStorage or IP address
      return [lat, lng, [city, region, country]];  
    }

    // If user location is not stored in local storage, fetch it from IP address
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const { latitude: lat, longitude: lng, city, region, country } = data;
    const location = [city, region, country];
    const userLocationArray = [lat, lng, location];
    localStorage.setItem('userLocation', JSON.stringify(userLocationArray));
    console.log(`Using lat:${lat} and lng:${lng} from IP address`); // Log to specify whether location was set from URL, localStorage or IP address
    return userLocationArray;
}

document.addEventListener('DOMContentLoaded', checkUserToken); // Check user token on page load