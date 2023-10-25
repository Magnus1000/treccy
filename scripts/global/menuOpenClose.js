// Function to open and close the menu
const profilePill = document.getElementById('profile-pill');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const desktopProfileDropdownDiv = document.getElementById('desktop-profile-dropdown-div');

profilePill.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        mobileMenuOverlay.style.display = 'flex';
    } else {
        desktopProfileDropdownDiv.style.display = 'flex';
    }
});