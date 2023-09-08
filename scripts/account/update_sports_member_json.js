<script>
// Wait for MemberStack to load
let checkMemberstack = setInterval(() => {
  if (typeof window.$memberstackDom !== 'undefined') {
    clearInterval(checkMemberstack);
    initScript();
  }
}, 100);

function initScript() {
  // Getting reference to MemberStack DOM
  const memberstack = window.$memberstackDom;

  document.addEventListener('DOMContentLoaded', async (event) => {
    // Fetch memberJson on page load and apply active checkboxes
    let memberJson = await memberstack.getMemberJSON();
    while (memberJson.data) {
      memberJson = memberJson.data;
    }
    setActiveCheckboxes(memberJson);

    document.getElementById('profile_preferences').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (typeof memberstack === 'undefined') {
        console.error('MemberStack is not defined');
        return;
      }

      await updateMemberJsonOnFormSubmit();
    });
  });

  // Function to apply the active tag to checkboxes based on sports in memberJson
  async function setActiveCheckboxes(memberJson) {
    console.log('Fetched memberJson:', memberJson);

    memberJson.sports.forEach(sport => {
      const checkbox = document.querySelector(`.disciplinefilter_checkbox[filter-value="${sport}"]`);

      if (checkbox) {
        checkbox.checked = true;
        checkbox.closest('.w-checkbox').classList.add('active-filter');
        console.log(`Added active-filter to the checkbox for ${sport}`);
      }
    });
  }

  async function updateMemberJsonOnFormSubmit() {
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

    memberJson.sports = newSportsArray;

    await memberstack.updateMemberJSON({ json: memberJson }).then(() => {
      console.log('Member data updated:', memberJson);
    }).catch((error) => {
      console.error('Failed to update member JSON:', error);
    });
  }
}
</script>
