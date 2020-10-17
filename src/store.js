import $ from 'jquery';

const bookmarks = [];
const status = {
  error: null,
  filter: "",
  currentPage: 'main'
}

// adds new bookmark to bookmarks[] for local storage
function addNewBookmark(bookmark) {
    bookmark.expanded = false;
    this.bookmarks.push(bookmark);
}

// searches through bookmarks[] to find bookmark with matching id
function findById(id) {
    return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

// filters through bookmarks[] to find results matching the status.filter value
function filterBy() {
    return this.bookmarks.filter(bookmark => bookmark.rating >= status.filter);
}

// searches through bookmarks[] to find bookmark with matching id and delete
function findAndDelete(id) {
   this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
}

// searches through bookmarks[] to find bookmark with matching id and update it
function findAndUpdate(id, newData) {
    let bookmark = this.items.find(bookmark => bookmark.id === id);
    Object.assign(bookmark, newData);
}

// saves any errors recieved during the process
function saveError(error) {
    this.status.error = error;
}

export default {
    bookmarks,
    status,
    addNewBookmark,
    findById,
    filterBy,
    findAndDelete,
    findAndUpdate,
    saveError
};
