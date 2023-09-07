<script>
document.addEventListener('DOMContentLoaded', (event) => {
    const memberstack = window.$memberstackDom;
    let likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(likeButton => {
        let likeButtonLastClickedAt = 0;

        likeButton.addEventListener('click', async function () {
            const now = Date.now();
            if (now - likeButtonLastClickedAt < 500) {
                return;
            }
            likeButtonLastClickedAt = now;

            const algoliaObjectID = this.getAttribute('data-object-id');
            this.classList.toggle('is-liked');  // A more concise way to toggle the class

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

            // Find the index of the object with the corresponding algoliaObjectID
            const index = memberJson.likes.findIndex(item => item.id === algoliaObjectID);

            // If not found, add it, otherwise remove it
            if (index === -1) {
                memberJson.likes.push({ id: algoliaObjectID, timestamp: Date.now() });
            } else {
                memberJson.likes.splice(index, 1);
            }

            memberstack.updateMemberJSON({ json: memberJson }).catch((error) => {
                console.error("Failed to update member JSON: ", error);
                this.classList.toggle('is-liked');  // Toggle the class back if the update fails
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
});
</script>
