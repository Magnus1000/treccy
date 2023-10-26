const collectionList = document.getElementsByClassName('collection-list-2x')[0];
const fourthItem = collectionList.children[3];

if (fourthItem) {
    const fourthItemChildren = fourthItem.querySelectorAll('[data-4th-item="true"]');
    fourthItem.classList.add('last-item');
    fourthItemChildren.forEach(child => child.classList.add('last-item'));
}