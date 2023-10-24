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

// Function to format the sports array
function formatSports(sportsArray) {
  // Convert each sport to title case
  const formattedSports = sportsArray.map(sport => {
    return sport.charAt(0).toUpperCase() + sport.slice(1);
  });
  
  // Join the array elements with a comma and a space
  return formattedSports.join(', ');
}
