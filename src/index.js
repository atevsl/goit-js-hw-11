const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEll = document.querySelector('.search-form');
const galleryEll = document.querySelector('.gallery');
const loadMoreButtonEll = document.querySelector('#load-more');

let page = 1;
let photo = undefined;
let pagesLeft = 0;
const per_page = 40;

formEll.addEventListener('submit', handleSubmit);
loadMoreButtonEll.addEventListener('click', handleLoadMore);

function renderpicture(picture) {
  return `<div class="photo-card">
          <a href=${picture.largeImageURL}><img src=${picture.webformatURL} alt=${picture.tags} loading="lazy" width=270px height=180px/>
    <div class="info">
      <p class="info-item">
          <b>❤️Likes: ${picture.likes}</b>
      </p>
      <p class="info-item">
          <b>👁️Views: ${picture.views}</b>
      </p>
      <p class="info-item">
          <b>Comments: 🗨️${picture.comments}</b>
      </p>
      <p class="info-item">
           <b>Downloads: ⏬${picture.downloads}</b>
      </p>
    </div></a>
  </div>`;
}

function getImg(photo, page) {
  return axios.get(
    `https://pixabay.com/api/?key=32042597-d449e2f3b6adbf69100237dc7&q=${photo}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
  );
}

async function handleSubmit(e) {
  e.preventDefault();
  loadMoreButtonEll.classList.add('hidden');
  loadMoreButtonEll.classList.remove('load-more');

  page = 1;
  photo = e.currentTarget.elements.searchQuery.value;
  galleryEll.innerHTML = '';
  await getImg(photo, page).then(response => {
    if (photo === ' ' || photo === '') {
      Notiflix.Notify.failure('Please type search and try again.');
      return;
    }
    pagesLeft = response.data.totalHits;
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${pagesLeft} images.`);
      galleryEll.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => renderpicture(picture)).join('')
      );
      pagesLeft -= per_page;
      loadMoreButtonEll.classList.remove('hidden');
      loadMoreButtonEll.classList.add('load-more');
    }
  });
  lightBox.refresh();
}

async function handleLoadMore() {
  page += 1;
  if (pagesLeft <= 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    await getImg(photo, page).then(response =>
      galleryEll.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => renderpicture(picture)).join('')
      )
    );
    pagesLeft -= per_page;
  }
  lightBox.refresh();
}

const lightBox = new SimpleLightBox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
