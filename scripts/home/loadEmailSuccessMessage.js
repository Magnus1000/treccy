function loadDivInSlices() {
    console.log("loadDivInSlices function called");

    const targetDiv = document.getElementById('divReveal');
    const hideDiv = document.getElementById('divHide');

    targetDiv.style.visibility = 'hidden'; // hide the target div
    targetDiv.style.display = 'flex';
    console.log("Target div display style updated to flex");

    const loadDirection = targetDiv.getAttribute('data-load-direction');
    const step = parseInt(targetDiv.getAttribute('data-step-count'), 10) || 10;
    const timeStep = parseInt(targetDiv.getAttribute('data-time-step'), 10) || 100; // get the time step from the data-time-step attribute

    // Function to set height dynamically
    const setHeight = (height) => {
        targetDiv.style.height = `${height}px`;
    };

    // Function to set width dynamically
    const setWidth = (width) => {
        targetDiv.style.width = `${width}px`;
    };

    if (loadDirection === 'vertical') {
        const finalHeight = hideDiv.offsetHeight;
        console.log("Hide div height selected:", finalHeight);
        loadInDirection('vertical', step, finalHeight, setHeight, timeStep); // pass the time step to the loadInDirection function
    } else {
        const finalWidth = hideDiv.offsetWidth;
        console.log("Hide div width selected:", finalWidth);
        loadInDirection('horizontal', step, finalWidth, setWidth, timeStep); // pass the time step to the loadInDirection function
    }

    setTimeout(() => {
        targetDiv.style.visibility = 'visible'; // show the target div after a 500ms pause
    }, 500);
}

// New function to handle loading based on direction and time step
function loadInDirection(direction, step, finalDimension, dimensionSetter, timeStep) {
    console.log(`Loading in ${direction} direction`);
    let currentDimension = 0;
    const interval = setInterval(() => {
        currentDimension += step;
        dimensionSetter(currentDimension);
        console.log(`Current ${direction} dimension: ${currentDimension}px`);

        if (currentDimension >= finalDimension) {
            clearInterval(interval);
            console.log(`Reached final ${direction} dimension`);
        }
    }, timeStep); // use the time step to set the interval
}