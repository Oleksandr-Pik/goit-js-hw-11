import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './js/getimages.js';
import { imgPerPage } from './js/getimages.js';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.js-load-more');

let query = '';
let currentPage = 1;

searchForm.addEventListener('submit', async evt => {
  evt.preventDefault();
  query = '';
  currentPage = 1;
  const { searchQuery } = evt.currentTarget.elements;
  query = searchQuery.value;
  loadMore.hidden = true;
  gallery.innerHTML = '';

  try {
    const data = await getImages(query, currentPage);
    // console.log(data.hits);

    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    initLightbox();

    if (currentPage !== Math.ceil(data.totalHits / imgPerPage)) {
      loadMore.hidden = false;
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Sorry, something went wrong!');
  }
});



function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="200" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: </b>${likes}
          </p>
          <p class="info-item">
            <b>Views: </b>${views}
          </p>
          <p class="info-item">
            <b>Comments: </b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
}

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  currentPage += 1;
  try {
    const data = await getImages(query, currentPage);
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

    // console.log(currentPage);
    // console.log(data.totalHits);
    // console.log(imgPerPage);

    // console.log(Math.ceil(data.totalHits / imgPerPage));

    // console.log(data);

    if (currentPage === Math.ceil(data.totalHits / imgPerPage)) {
      loadMore.hidden = true;
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Sorry, something went wrong!');
  }
  
  initLightbox();

  // lightbox.refresh();

}

function initLightbox() {
  let lightbox = new SimpleLightbox('.gallery a');

    lightbox.options.captionsData = 'alt';
    lightbox.options.captionDelay = 250;

}
