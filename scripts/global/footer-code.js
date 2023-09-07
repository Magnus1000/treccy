<script>
  $(document).ready(function() {
    // Get the current page's URL path
    var path = window.location.pathname;

    // Remove any leading or trailing slashes from the path
    path = path.replace(/\/$/, "");
    path = path.substr(1);

    // Find the vertical menu item that corresponds to the current page and add the "active-vertical-menu-item" class
    $(".vertical-menu-item[data-url='" + path + "']").addClass("active-vertical-menu-item");

    // Find the horizontal menu item that corresponds to the current page and add the "active-horizontal-menu-item" class
    $(".horizontal-menu-item[data-url='" + path + "']").addClass("active-horizontal-menu-item");
  });
</script>