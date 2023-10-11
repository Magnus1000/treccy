async function getUserLocation() {
    let lat = parseFloat(localStorage.getItem('lat'));
    let lng = parseFloat(localStorage.getItem('lng'));

    if (isNaN(lat) || isNaN(lng)) {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        lat = parseFloat(data.latitude);
        lng = parseFloat(data.longitude);
        localStorage.setItem('lat', lat);
        localStorage.setItem('lng', lng);
        console.log(`Using lat:${lat} and lng:${lng} from IP address`);
    } else {
        console.log(`Using lat:${lat} and lng:${lng} from localStorage`);
    }

    return { lat, lng };
}

async function fetchEmailRacesFromVercel(lat, lng) {
    // fetch lat lng 
    getUserLocation();
    const apiUrl = 'https://treccy-serverside-magnus1000team.vercel.app/api/fetchEmailRaces.js';
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
        } else {
            console.log('No races found via Vercel function.');
        }
    } catch (error) {
        console.error('An error occurred while fetching races from Vercel function:', error);
    }
}

function updateRaceNames(results) {
    const race2 = document.getElementById('newsletter-race-2');
    const race3 = document.getElementById('newsletter-race-3');
    const race4 = document.getElementById('newsletter-race-4');
    const race5 = document.getElementById('newsletter-race-5');

    race2.textContent = results[1].name_ag;
    race3.textContent = results[2].name_ag;
    race4.textContent = results[3].name_ag;
    race5.textContent = results[4].name_ag;
}

window.addEventListener('load', async () => {
    const { lat, lng } = await getUserLocation();
    await fetchEmailRacesFromVercel(lat, lng);
});