import $ from 'jquery';
import './main.css';
// Imports bookmarks[] and other{} from Store
import store from './store.js';
// Imports all the functions from Store
import {addNewBookmark, findById, filterBy, findAndDelete, findAndUpdate, setError} from './store.js';
import {render, bindEventListeners} from './bookmarks.js';
import {getList, createBookmark, deleteBookmark} from './api.js';

function main() {
    getList()
      .then(data => {data.forEach(bookmark => addBookmark(bookmark));
      render();
    });
    bindEventListeners();
}

$(main);
