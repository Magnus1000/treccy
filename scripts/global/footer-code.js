// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().substr(-2);
  const formattedDate = `${day} ${month} ${year}`;
  console.log("Formatted date:", formattedDate);
  return formattedDate;
}
