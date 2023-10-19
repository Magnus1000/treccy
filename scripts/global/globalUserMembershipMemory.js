// Log the initiation of the script
console.log("globalUserMembershipMemory.js script initiated");

var lat; // Declare global variable for latitude
console.log(`Global variable lat ${lat} declared in the globalUserMembershipMemory.js script`);
var lng; // Declare global variable for longitude
console.log(`Global variable lng ${lng} declared in the globalUserMembershipMemory.js script`);

// Function to check and set a user token to local storage
(async () => {
    const userToken = await checkUserToken();
    console.log(`User token: ${userToken}`);
})();

// Function to check and set a user token to local storage
async function checkUserToken() {
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
      const [lat, lng, [city, region]] = userLocation;
      console.log(`Global variable lat ${lat} reassigned from localStorage in the getUserLocation function`);
      console.log(`Global variable lat ${lng} reassigned from localStorage in the getUserLocation function`);
      return [lat, lng, [city, region]];  
    }

    // If user location is not stored in local storage, fetch it from IP address
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const { latitude: lat, longitude: lng, city, region } = data;
    const location = [city, region];
    const userLocationArray = [lat, lng, location];
    localStorage.setItem('userLocation', JSON.stringify(userLocationArray));
    console.log(`userLocation set to ${userLocationArray} by IP address in the getUserLocation function`);
    console.log(`Global variable lat ${lat} reassigned from IP address in the getUserLocation function`);
    console.log(`Global variable lat ${lng} reassigned from IP address in the getUserLocation function`);
    return userLocationArray;
}