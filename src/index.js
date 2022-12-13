const axios = require('axios').default;
import Notiflix from 'notiflix';

const formEll = document.querySelector('.search-form');
const srcButtonEll = document.querySelector('.searchButton');
const galleryEll = document.querySelector('.gallery');

formEll.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const pick = e.currentTarget.elements.searchQuery.value;
  getImg(pick).then(response => {
    console.log(response.data.hits.length);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      galleryEll.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => renderpicture(picture)).join('')
      );
    }
  });
  // webformatURL - ссылка на маленькое изображение для списка карточек.
  // largeImageURL - ссылка на большое изображение.
  // tags - строка с описанием изображения. Подойдет для атрибута alt.
  // likes - количество лайков.
  // views - количество просмотров.
  // comments - количество комментариев.
  // downloads - количество загрузок.
  // });
}

function renderpicture(picture) {
  return `<div class="photo-card">
        <img src=${picture.webformatURL} alt=${picture.tags} loading="lazy" width=300/>
  <div class="info">
    <p class="info-item">
        <b>Likes: ${picture.likes}</b>
    </p>
    <p class="info-item">
        <b>Views: ${picture.views}</b>
    </p>
    <p class="info-item">
        <b>Comments: ${picture.comments}</b>
    </p>
    <p class="info-item">
         <b>Downloads: ${picture.downloads}</b>
    </p>
  </div>
</div>`;
}

function getImg(pick) {
  // return fetch(
  //   `https://pixabay.com/api/?key=32042597-d449e2f3b6adbf69100237dc7&q=${pick}&image_type=photo&orientation=horizontal&safesearch=true`
  // ).then(res => res.json());
  return axios.get(
    `https://pixabay.com/api/?key=32042597-d449e2f3b6adbf69100237dc7&q=${pick}&image_type=photo&orientation=horizontal&safesearch=true`
  );
}
