import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

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
    console.log(data.hits);

    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    let lightbox = new SimpleLightbox('.gallery a');

    lightbox.options.captionsData = 'alt';
    lightbox.options.captionDelay = 250;

    if (currentPage !== Math.round(data.totalHits / data.hits.length)) {
      loadMore.hidden = false;
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Sorry, something went wrong!');
  }
});

async function getImages(query, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40334157-8af7e21c23f15ddda27e49965';

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw error;
  }
}

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

    if (currentPage == Math.round(data.totalHits / data.hits.length)) {
      loadMore.hidden = true;
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Sorry, something went wrong!');
  }
  let lightbox = new SimpleLightbox('.gallery a');

  lightbox.options.captionsData = 'alt';
  lightbox.options.captionDelay = 250;
  
  // lightbox.refresh();

}
