console.log("Formatted date function loaded...");

// Define memberstack here so you can use it in both scripts
const memberstack = window.$memberstackDom;

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().substr(-2);
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

// Function to format the distances array
function formatDistances(distancesArray) {
  // Sort the array in ascending order and divide each value by 1000 to convert to km
  const sortedDistances = distancesArray.sort((a, b) => a - b).map(distance => distance / 1000);
  
  let formattedDistances = ""; // Initialize an empty string to store the formatted distances
  
  // Check the length of the array to format accordingly
  if (sortedDistances.length === 0) {
    formattedDistances = "N/A"; // If no distances are available, set to "N/A"
  } else if (sortedDistances.length === 1) {
    formattedDistances = `${sortedDistances[0]}km`; // If only one distance is available
  } else if (sortedDistances.length === 2) {
    formattedDistances = `${sortedDistances[0]}km • ${sortedDistances[1]}km`; // If two distances are available
  } else {
    formattedDistances = `${sortedDistances[0]}km - ${sortedDistances[sortedDistances.length - 1]}km`; // If more than two, show the smallest and largest
  }
  
  return formattedDistances;
}

// Function to format the sports array
function formatSports(sportsArray) {
  // Convert each sport to title case
  const formattedSports = sportsArray.map(sport => {
    return sport.charAt(0).toUpperCase() + sport.slice(1);
  });
  
  // Join the array elements with a comma and a space
  return formattedSports.join(', ');
}
