import $ from 'jquery';
import './main.css';
// Imports all the functions from Store
import store from './store.js';
import bookmarks from './bookmarks.js';
import api from './api.js';

function main() {
    api.getList()
      .then(data => {data.forEach(bookmark => store.addNewBookmark(bookmark));
      bookmarks.render();
    });
    bookmarks.bindEventListeners();
}

$(main);