// Function to open and close the menu
const profilePill = document.getElementById('profile-pill');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const desktopProfileDropdownDiv = document.getElementById('desktop-profile-dropdown-div');

// Function to add event listener to profile pill
profilePill.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        mobileMenuOverlay.style.display = 'flex';
        console.log('Mobile menu opened');
    } else {
        desktopProfileDropdownDiv.style.display = 'flex';
        console.log('Desktop menu opened');
    }
});

// Add event listener to mobile menu overlay
mobileMenuOverlay.addEventListener('click', () => {
    mobileMenuOverlay.style.display = 'none';
    console.log('Mobile menu closed');
});