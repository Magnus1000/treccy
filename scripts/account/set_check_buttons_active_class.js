<script>
document.addEventListener('DOMContentLoaded', (event) => {

    // Make sure $memberstack is defined
    if (typeof window.$memberstack === 'undefined') {
      console.error('$memberstack is not defined');
      return;
    }

  async function updateMemberJsonOnFormSubmit() {
    // Make sure $memberstack is defined
    if (typeof window.$memberstack === 'undefined') {
      console.error('$memberstack is not defined');
      return;
    }

    // Initialize member JSON data
    let member = await window.$memberstack.getCurrentMember();
    let memberJson = await window.$memberstack.getMemberJSON();
    while (memberJson.data) {
      memberJson = memberJson.data;
    }

    // Initialize 'sports' if it does not exist
    if (!memberJson.sports) {
      memberJson.sports = [];
    }

    // Loop through all checkboxes and add/remove sports based on checkbox state
    document.querySelectorAll('.disciplinefilter_checkbox').forEach(checkbox => {
      const sportValue = checkbox.getAttribute('filter-value');
      const isChecked = checkbox.checked;

      if (isChecked) {
        memberJson.sports.push(sportValue);
      } else {
        const index = memberJson.sports.indexOf(sportValue);
        if (index > -1) {
          memberJson.sports.splice(index, 1);
        }
      }
    });
  }
});
</script>
