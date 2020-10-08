import $ from 'jquery';
import api from './api';
import store from './store';

const generateError = function (message) {
    return `
        <div class="error-display${!store.status.error ? ' hidden' : ''}">
            <p>${message}</p>
            <button id="close-error">Okay</button>
        </div>
        ${generateAddView()}
    `;
};

const renderError = function () {
    if (store.status.error) {
        const element = generateError(store.status.error);
        $('main').html(element);
    } else {
        $('main').html(generateAddView());
    }
};

const handleCloseError = function () {
    $('main').on('click', '#close-error', () => {
        store.saveError(null);
        renderError();
    });
};

const generateBookmarkElement = function (bookmark) {
    let rating = ''
    for (let i = 0; i < 5; i++) {
        if (bookmark.rating !== undefined && i < parseInt(bookmark.rating)) {
            rating += `<label class="fill gradient">&#9733;</label>`;
        } else {
            rating += `<label class="no-fill">&#9733;</label>`;
        }
    }

    let element;
    if (bookmark.expanded) {
        element = `
        <li>
            <span class="bookmark">${bookmark.title}<button id="delete">&#9851; Delete &#9851;</button></span>
            <div class="sub-header"> <a href="${bookmark.url}" target="\_blank" class="link gradient"> Visit Site </a> Rating: ${bookmark.rating ? bookmark.rating : 'None'}</div>
            <p class="desc">${bookmark.desc ? bookmark.desc : 'No description available.'}</p>
        </li>
        `;
    } else {
        element = `<li> <div class="bookmark"><span class="title">${bookmark.title}</span><span class="rating">${rating}</span></div> </li>`;
    }


    return `
    <div class="js-bookmark" id="${bookmark.id}">
        ${element}
    </div>`
};

const generateBookmarksString = function (bookmarkList) {
    const bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
    return `
        <div>
            <h2>&#127825; Bookmarks &#127825;</h2>
            <div id="btns-container">
                <button id="new">&#x1F35E; Add New Bookmark &#x1F35E;</button>
                <label type="text" id="rating"> Filter By: </label>
                <select name="rating" id="rating">
                    <option value="">Filter By</options>
                    <option value="1"> &#9733;</option>
                    <option value="2"> &#9733; &#9733;</option>
                    <option value="3"> &#9733; &#9733; &#9733;</option>
                    <option value="4"> &#9733; &#9733; &#9733; &#9733;</option>
                    <option value="5"> &#9733; &#9733; &#9733; &#9733; &#9733;</option>
                </select>
            </div>
            <ul>
                ${bookmarks.join('')}
            </ul>
        </div>
    `;
}

const handleFilter = function () {
    $('main').on('click', 'select', function () {
        let rating = $('select').val();
        if (rating) {
            store.status.filter = rating;
            render();
        }
    })
}

const generateAddView = function () {
    return (`
    <form>
        <h2>&#127825; Bookmarks &#127825;</h2>
        <h3> Add a New Bookmark! </h3>

        <label for="url"> URL: </label>
        <input type="text" id="url" placeholder="https://www.example.com" required>
        <label for="title"> Bookmark Name </label>
        <input type="text" id="title" placeholder="Name" required>
        <label type="text" id="rating"> Rating </label>

        <div id="rating" required>
        <ul>
            <li class="inline">
                <input type="radio" id="1-star" class="no-fill" name="rating" value="1" required>
                <label for="1-star" class="no-fill">&#9733;</label>
            </li>
            <li class="inline">
                <input type="radio" id="2-star" class="no-fill" name="rating" value="2" required>
                <label for="2-star" class="no-fill">&#9733;</label>
            </li>
            <li class="inline">
                <input type="radio" id="3-star" class="no-fill" name="rating" value="3" required>
                <label for="3-star" class="no-fill">&#9733;</label>
            </li>
            <li class="inline">
                <input type="radio" id="4-star" class="no-fill" name="rating" value="4" required>
                <label for="4-star" class="no-fill">&#9733;</label>
            </li>
            <li class="inline">
                <input type="radio" id="5-star" class="no-fill" name="rating" value="5" required>
                <label for="5-star" class="no-fill">&#9733;</label>
            </li>
        </ul>
        </div>
        <div>
            <label for="desc">Description</label>
        </div>
            <input type="textarea" id="desc" placeholder="Add a description (optional)">
        <div>
            <button type="reset">Cancel</button>
            <button type="submit">Create</button>
        </div>
    </form>
    <div>
      <button onclick="window.location.href='https://www.youtube.com/watch?v=oHg5SJYRHA0'">&#129505; Don't Click Me &#129505;</button>
    </div>
    `)
}

const render = function () {
    let bookmarks = store.filterBy();

    const bookmarksString = generateBookmarksString(bookmarks);

    $('main').html(bookmarksString);
}

const handleRatingSelected = function () {
    $('main').on('click', 'input[name="rating"]', function () {
        $(this).prevAll('label').addClass("fill gradient").removeClass("no-fill");
        $(this).nextAll('label').addClass("no-fill").removeClass("fill gradient");
        $(this).next('label').addClass('fill gradient').removeClass('no-fill');
    })
}

const handleBookmarkClick = function () {
    $('main').on('click', '.js-bookmark', function (event) {
        let id = $(event.currentTarget).attr('id');
        let bookmark = store.findById(id);
        bookmark.expanded = !bookmark.expanded;
        render();
    })
};

function handleCreate() {
    $('main').on('submit', function (event) {
        event.preventDefault();
        const title = $('#title').val();
        const url = $('#url').val();
        const rating = $('input[name="rating"]:checked').val();
        const desc = $('#desc').val();
        const bookmark = { 'title': title, 'url': url, 'rating': rating, 'desc': desc };
        api.createBookmark(bookmark)
            .then(data => {
                store.addNewBookmark(data);
                render();
            })
            .catch((error) => {
                console.log(error);
                store.saveError(error.message);
                renderError();
            });
    });
};

function handleNew() {
    $('main').on('click', '#new', function () {
        renderError();
    });
};

function handleCancel() {
    $('main').on('reset', function (event) {
        event.preventDefault();
        render();
    })
}

function handleDelete() {
    $('main').on('click', '#delete', function (event) {
        const element = $(event.currentTarget).closest('.js-bookmark');
        const id = $(element).attr('id');
        api.deleteBookmark(id)
            .then(() => {
                store.findAndDelete(id);
                render();
            })
            .catch((error) => {
                console.log(error);
                store.saveError(error.message);
                renderError();
            });
    })
}

const bindEventListeners = function () {
    handleBookmarkClick();
    handleCreate();
    handleDelete();
    handleCancel();
    handleNew();
    handleRatingSelected();
    handleFilter();
    handleCloseError();
}

export default { render, bindEventListeners };
