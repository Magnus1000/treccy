<script>
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

  // Assuming that memberstack is globally accessible
  const memberstack = window.$memberstackDom;

  async function updateMemberJsonOnFormSubmit() {
    // Check if memberstack is defined
    if (typeof memberstack === 'undefined') {
      console.error('MemberStack is not defined');
      return;
    }

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
</script>
