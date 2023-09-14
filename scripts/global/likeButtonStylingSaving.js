// Function to initialize like buttons
function initLikeButtons() {
    let likeButtons = document.querySelectorAll('.like-button');

    // Log the count of "like-button" elements found
    console.log(`Found ${likeButtons.length} 'like-button' elements.`);

    likeButtons.forEach(likeButton => {
        let likeButtonLastClickedAt = 0;

        // Log that we're adding an event listener to this button
        console.log('Adding event listener to a like-button.');

        likeButton.addEventListener('click', async function () {
            const now = Date.now();
            if (now - likeButtonLastClickedAt < 500) {
                return;
            }
            likeButtonLastClickedAt = now;

            const algoliaObjectID = this.getAttribute('data-object-id');
            this.classList.toggle('is-liked');  

            let member = await memberstack.getCurrentMember();
            if (!member || !member.data) {
                window.location.href = '/sign-up-auth';
                return;
            }

            let memberJson = await memberstack.getMemberJSON();
            while (memberJson.data) {
                memberJson = memberJson.data;
            }

            if (!memberJson.likes) {
                memberJson.likes = [];
            }

            const index = memberJson.likes.findIndex(item => item.id === algoliaObjectID);

            if (index === -1) {
                memberJson.likes.push({ id: algoliaObjectID, timestamp: Date.now() });
            } else {
                memberJson.likes.splice(index, 1);
            }

            memberstack.updateMemberJSON({ json: memberJson }).catch((error) => {
                console.error("Failed to update member JSON: ", error);
                this.classList.toggle('is-liked');
            });
        });

        (async function initButtonState() {
            let member = await memberstack.getCurrentMember();
            if (!member || !member.data) {
                return;
            }

            let memberJson = await memberstack.getMemberJSON();
            while (memberJson.data) {
                memberJson = memberJson.data;
            }

            let algoliaObjectID = likeButton.getAttribute('data-object-id');
            const isLiked = memberJson.likes && memberJson.likes.some(item => item.id === algoliaObjectID);
            if (isLiked) {
                likeButton.classList.add('is-liked');
            }
        })();
    });

    // Log that event listeners have been successfully added
    console.log('Successfully added event listeners to all like-buttons.');
}

// Initialize like buttons when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded. Initializing like-buttons.');
    initLikeButtons();
});
