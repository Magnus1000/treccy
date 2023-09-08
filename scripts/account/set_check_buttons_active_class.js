<script>
  document.addEventListener('DOMContentLoaded', async (event) => {
    function checkMemberstackDefined() {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (typeof window.$memberstack !== 'undefined') {
            clearInterval(interval);
            resolve();
          }
        }, 100); // check every 100ms
      });
    }

    await checkMemberstackDefined();

    // Initialize member JSON data
    let memberJson = await window.$memberstack.getMemberJSON();

    // Check for 'data' property and assign it to memberJson
    if (memberJson && memberJson.data) {
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

      // Log for debugging
      console.log(`Sport Value: ${sportValue}, Is Checked: ${isChecked}`);

      if (isChecked) {
        memberJson.sports.push(sportValue);

        // Set the 'active-filter' state
        checkbox.classList.add('active-filter');
      } else {
        const index = memberJson.sports.indexOf(sportValue);
        if (index > -1) {
          memberJson.sports.splice(index, 1);
        }

        // Remove the 'active-filter' state
        checkbox.classList.remove('active-filter');
      }
    });
  });
</script>
