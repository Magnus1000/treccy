// Apply hover class to all child elements of an element with data-hover-children="true"
const hoverChildren = document.querySelectorAll('[data-hover-children="true"]');

hoverChildren.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        console.log('Mouse entered element:', element);
        element.querySelectorAll('*').forEach((child) => {
            console.log('Adding hover class to child:', child);
            child.classList.add('hover');
        });
    });

    element.addEventListener('mouseleave', () => {
        console.log('Mouse left element:', element);
        element.querySelectorAll('*').forEach((child) => {
            console.log('Removing hover class from child:', child);
            child.classList.remove('hover');
        });
    });
});