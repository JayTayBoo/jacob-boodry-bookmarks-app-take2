import $ from 'jquery';

const baseURL='https://thinkful-list-api.herokuapp.com/jakeb/bookmarks';

function apiFetch(...args ) {
    let error;
    return fetch(...args)
        .then(res => {
            if(!res.ok){
                error = {code:res.status};

                if(!res.headers.get('content-type').includes('json')){
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
            }

            return res.json();
        })
        .then(data => {
            if(error){
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
}

// runs apiFetch to grab all existing Bookmarks
function getList() {
    return apiFetch(baseURL);
}

// runs apiFetch to create a new bookmark
function createBookmark(bookmark) {
    const bookmarkItem = JSON.stringify(bookmark)
    return apiFetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bookmarkItem,
    });
}

// runs apiFetch to delete bookmark from database
function deleteBookmark(id) {
    return apiFetch(`${baseURL}/${id}`, {
        method: "DELETE",
    });
}

export default {
  getList,
  createBookmark,
  deleteBookmark
};