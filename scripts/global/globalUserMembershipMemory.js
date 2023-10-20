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
    // Attempt to get user location from local storage
    const userLocation = JSON.parse(localStorage.getItem('userLocation'));
    if (userLocation) {
        // Using destructuring to reassign lat, lng globally, and declare location as local variable
        [lat, lng, let location] = userLocation;
        console.log(`Global variable lat ${lat} reassigned from localStorage in the getUserLocation function`);
        console.log(`Global variable lng ${lng} reassigned from localStorage in the getUserLocation function`);
        return [lat, lng, location];
    }

    // Fetch user location from IP address if not found in local storage
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    // Reassign global lat and lng variables, and declare location as a local variable
    lat = data.latitude;
    lng = data.longitude;
    const location = [data.city, data.region];

    // Store the user location in local storage
    const userLocationArray = [lat, lng, location];
    localStorage.setItem('userLocation', JSON.stringify(userLocationArray));
    localStorage.setItem('locationSource', "ip_address");

    console.log(`userLocation set to ${userLocationArray} by IP address in the getUserLocation function`);
    console.log(`Global variable lat ${lat} reassigned from IP address in the getUserLocation function`);
    console.log(`Global variable lng ${lng} reassigned from IP address in the getUserLocation function`);
    
    return userLocationArray;
}