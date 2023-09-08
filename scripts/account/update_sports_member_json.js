<script>
// Define the updateMemberJsonOnFormSubmit function as globally accessible
async function updateMemberJsonOnFormSubmit() {
    // Here, we directly get a reference to MemberStack DOM each time we call this function
    const memberstack = window.$memberstackDom;

    let member = await memberstack.getCurrentMember();
    let memberJson = await memberstack.getMemberJSON();

    while (memberJson.data) {
      memberJson = memberJson.data;
    }

    // Check if 'sports' exists in memberJson, if not initialize it
    if (!memberJson.sports) {
        memberJson.sports = [];
    }

    // Initialize a new array to hold selected sports
    let newSportsArray = [];

    document.querySelectorAll('.disciplinefilter_checkbox').forEach(checkbox => {
      const sportValue = checkbox.getAttribute('filter-value');
      const isChecked = checkbox.checked;

      if (isChecked) {
        newSportsArray.push(sportValue);
      }
    });

    // Replace the entire 'sports' array with the new array
    memberJson.sports = newSportsArray;

    await memberstack.updateMemberJSON({ json: memberJson }).then(() => {
      console.log('Member data updated:', memberJson);
    }).catch((error) => {
      console.error('Failed to update member JSON:', error);
    });
}

// Wait for MemberStack to load
  let checkMemberstack = setInterval(() => {
    if (typeof window.$memberstackDom !== 'undefined') {
      clearInterval(checkMemberstack);
      initScript();
    }
  }, 100);

  function initScript() {
    const memberstack = window.$memberstackDom;
    document.addEventListener('DOMContentLoaded', (event) => {
      const submitButton = document.getElementById('submit-preferences');

      if (submitButton) {
        submitButton.addEventListener('click', async function(e) {
          e.preventDefault();
          console.log("Button clicked.");

          if (typeof memberstack === 'undefined') {
            console.error('MemberStack is not defined');
            return;
          }
          await updateMemberJsonOnFormSubmit();
        });
      } else {
        console.error('Button with ID submit-preferences not found');
      }
    });
  }
</script>
