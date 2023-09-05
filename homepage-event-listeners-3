<!-- ############################################ EVENT LISTENERS 3 ############################################ -->
<!-- This script handles all of the favoriting/likes functionality including displaying the hearts, styling them and adding event listeners -->
<script>
document.addEventListener('DOMContentLoaded', async (event) => {
  console.log("DOM fully loaded and parsed");

  const memberstack = window.$memberstackDom;
  const likeButtons = document.querySelectorAll('.like-button');

  likeButtons.forEach(likeButton => {
    let likeButtonLastClickedAt = 0;

    likeButton.addEventListener('click', async function () {
      console.log("Button clicked!");

      const now = Date.now();
      if (now - likeButtonLastClickedAt < 500) {
        console.log("Click ignored: too soon after last click");
        return;
      }
      likeButtonLastClickedAt = now;

      console.log("Optimistically updating UI");
      const dataObjectID = this.getAttribute('data-object-id');
      if (this.classList.contains('is-liked')) {
        console.log("Removing 'is-liked' class");
        this.classList.remove('is-liked');
      } else {
        console.log("Adding 'is-liked' class");
        this.classList.add('is-liked');
      }

      console.log("Getting current member");
      let member = await memberstack.getCurrentMember();

      if (!member || !member.data) {
        console.log("Member not logged in. Redirecting to sign-up page");
        window.location.href = '/sign-up-auth';
        return;
      }

      console.log("Fetching member JSON");
      let memberJson = await memberstack.getMemberJSON();

      while (memberJson.data) {
        memberJson = memberJson.data;
      }

      if (!memberJson.likes) {
        console.log("Creating 'likes' array in member JSON");
        memberJson.likes = [];
      }

      if (!memberJson.likes.includes(dataObjectID)) {
        console.log(`Adding ${dataObjectID} to 'likes' array`);
        memberJson.likes.push(dataObjectID);
      } else {
        console.log(`Removing ${dataObjectID} from 'likes' array`);
        memberJson.likes = memberJson.likes.filter(item => item !== dataObjectID);
      }

      console.log("Updating member JSON asynchronously");
      memberstack.updateMemberJSON({ json: memberJson }).catch((error) => {
        console.error("Failed to update member JSON: ", error);
        if (this.classList.contains('is-liked')) {
          console.log("Reverting button style due to error");
          this.classList.remove('is-liked');
        } else {
          console.log("Reverting button style due to error");
          this.classList.add('is-liked');
        }
      });
    });

    (async function initButtonState() {
      console.log("Initializing button state based on member's likes");

      let member = await memberstack.getCurrentMember();

      if (!member || !member.data) {
        console.log("Member not logged in. Skipping initialization.");
        return;
      }

      let memberJson = await memberstack.getMemberJSON();

      while (memberJson.data) {
        memberJson = memberJson.data;
      }

      let dataObjectID = likeButton.getAttribute('data-object-id');

      if (memberJson.likes && memberJson.likes.includes(dataObjectID)) {
        console.log("Member has already liked this. Button initialized to 'liked'");
        likeButton.classList.add('is-liked');
      } else {
        console.log("Member has not liked this. Button initialized to 'unliked'");
      }
    })();
  });
});
</script>
