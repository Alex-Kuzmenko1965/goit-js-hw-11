import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

import { fetchPixabay } from "./js/fetchPixabay.js";

const refs = {
  form: document.getElementById('search-form'),
  btn: document.querySelector('button'),
  galleryList: document.querySelector('.gallery'),
};
console.log(refs.form);
console.log(refs.btn);
console.log(refs.galleryList);

refs.form.addEventListener("submit", onSubmit);

async function onSubmit(e) {  
  e.preventDefault();  
  const query = e.currentTarget.searchQuery.value;  
  console.log(query);
  // clearGalleryList();  
  const { hits } = await fetchPixabay(query);
  console.log(hits);  
  try {             
      if (hits.length) {
        const markup = hits.reduce(
          (markup, hits) => markup + createMarkupList(hits), "");
        console.log(markup);
        updateGalleryList(markup);
      }  
    } catch (error) {onError()}  
  }

function createMarkupList({ webformatURL, largeImageURL,tags, likes, views, comments, downloads }) {  
  return `
  <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}</b>
    </p>
  </div>
</div>`;
};

function updateGalleryList(markup) {
  refs.galleryList.innerHTML = markup;
  console.log(refs.galleryList);
};

function onError(err) {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');  
  refs.galleryList.innerHTML = "";
};
