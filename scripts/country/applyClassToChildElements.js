// Apply hover class to all child elements of an element with data-hover-children="true"
const hoverChildren = document.querySelectorAll('[data-hover-children="true"]');

hoverChildren.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        element.querySelectorAll('*').forEach((child) => {
            child.classList.add('hover');
        });
    });

    element.addEventListener('mouseleave', () => {
        element.querySelectorAll('*').forEach((child) => {
            child.classList.remove('hover');
        });
    });
});