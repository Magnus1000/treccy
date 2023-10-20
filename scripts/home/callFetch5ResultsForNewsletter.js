async function fetchEmailRacesFromVercel(lat, lng) {
    const apiUrl = 'https://treccy-serverside-magnus1000team.vercel.app/api/treccywebsite/fetchEmailRaces.js';
    const filters = { lat, lng, results: 5 };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        if (response.ok) {
            const results = await response.json();
            console.log('Results fetched from Vercel function:', results);
            updateRaceNames(results);
            addTomorrowsDate();
        } else {
            console.log('No races found via Vercel function.');
        }
    } catch (error) {
        console.error('An error occurred while fetching races from Vercel function:', error);
    }
}

function updateRaceNames(results) {
    const race1Image = document.getElementById('newsletter-race-1-image');
    const race2 = document.getElementById('newsletter-race-2');
    const race2Date = document.getElementById('newsletter-race-2-date');
    const race2City = document.getElementById('newsletter-race-2-city');
    const race3 = document.getElementById('newsletter-race-3');
    const race3Date = document.getElementById('newsletter-race-3-date');
    const race3City = document.getElementById('newsletter-race-3-city');
    const race4 = document.getElementById('newsletter-race-4');
    const race4Date = document.getElementById('newsletter-race-4-date');
    const race4City = document.getElementById('newsletter-race-4-city');
    const race5 = document.getElementById('newsletter-race-5');
    const race5Date = document.getElementById('newsletter-race-5-date');
    const race5City = document.getElementById('newsletter-race-5-city');

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    race1Image.src = results[0].photo_main_ag;
    race2.textContent = results[1].name_ag;
    race2Date.textContent = formatDate(results[1].date_ag);
    race2City.textContent = results[1].city_ag;
    race3.textContent = results[2].name_ag;
    race3Date.textContent = formatDate(results[2].date_ag);
    race3City.textContent = results[2].city_ag;
    race4.textContent = results[3].name_ag;
    race4Date.textContent = formatDate(results[3].date_ag);
    race4City.textContent = results[3].city_ag;
    race5.textContent = results[4].name_ag;
    race5Date.textContent = formatDate(results[4].date_ag);
    race5City.textContent = results[4].city_ag;

    const titleTextDivs = document.querySelectorAll('.email-recommended-race-title-text');
    for (let i = 0; i < titleTextDivs.length; i++) {
        titleTextDivs[i].classList.remove('hide');
    }

    const dateLocationDivs = document.querySelectorAll('.email-recommended-race-date-location');
    for (let i = 0; i < dateLocationDivs.length; i++) {
        dateLocationDivs[i].classList.remove('hide');
    }
}

function addTomorrowsDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = tomorrow.toLocaleDateString('en-US', options);
    const tomorrowsDateDiv = document.getElementById('email-tomorrows-date');
    tomorrowsDateDiv.classList.remove('hide');
    tomorrowsDateDiv.textContent = formattedDate;
}

window.addEventListener('load', async () => {
    const userLocationArray = await getUserLocation();
    let lat = userLocationArray[0];
    let lng = userLocationArray[1];
    await fetchEmailRacesFromVercel(lat, lng);
    addTomorrowsDate();
});

//Function to call all the functions that need to be called when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    await fetchAlgoliaKeysAndInit(lat,lng);
});
window.addEventListener('load', async () => {
    const userLocationArray = await getUserLocation();
    let lat = userLocationArray[0];
    let lng = userLocationArray[1];
    await fetchEmailRacesFromVercel(lat, lng);
    addTomorrowsDate();
});