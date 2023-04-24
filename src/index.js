import "./css/styles.css";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

import NewsApiService from "./js/NewsApiService.js";
import LoadMoreBtn from "./js/LoadMoreBtn.js";

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
  console.log("+");
});
let totalPage = 0;

const refs = {
  form: document.getElementById('search-form'),
  btn: document.querySelector('button'),
  galleryList: document.querySelector('.gallery'),
  head: document.querySelector('head'),
  styleEl: document.createElement("style"),
};

const styleAtr = `
    .search-form {
      display: flex;
      justify-content: center;
      background-color: rgb(50, 50, 160);
      padding: 10px;       
    }    
    .gallery {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      flex-basis: auto;
      justify-content: space-around;
      gap: 20px;
    }
    .gallery__link {
      display: block;        
      height: 200px;
    }
    .photo-card .info {
      width: 320px;
    }
    img {        
      width: 320px;
      height: 200px;
      object-fit: cover;
      background-size: auto;
    }
    .info {
      display: flex;
      justify-content: space-evenly;
      border-bottom: 1px solid #909090;       
    }        
    .info-item {
      text-align: center;
    }    
    button.hidden {
      display: none;
    }`;
 
refs.head.append(refs.styleEl);
const style = document.querySelector('style');
style.innerHTML = styleAtr;
// console.log(refs.head);

const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  isHidden: true,
});

refs.form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", loadMorePixabay);

function onSubmit(e) {   
  e.preventDefault();
  loadMoreBtn.hide();  
  const form = e.currentTarget;  
  newsApiService.query = form.elements.searchQuery.value;
  console.log(newsApiService.query);

  newsApiService.resetPage();
  clearGalleryList();
  fetchPixabay().finally(() => form.reset());
}
 
async function fetchPixabay() {
  try {
    const markup = await getHitsMarkup();
    // console.log(markup);    
    updateGalleryList(markup);  
    loadMoreBtn.enable();
  } catch (err) {
    onError(err);
  }  
}

async function loadMorePixabay() {  
  loadMoreBtn.disable();
  try {
    const markup = await loadMoreHitsMarkup();
    // console.log(markup);
    if (markup !== undefined)
    {updateGalleryList(markup);  
    loadMoreBtn.enable();}
  } catch (err) {
    endGalleryList(err);
  }  
}

async function getHitsMarkup() {  
  try {
    const { hits, totalHits } = await newsApiService.getNews();    
    if (hits.length === 0) throw new Error("No data!");
    {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images`);
      totalPage = Math.ceil(totalHits / NewsApiService.PER_PAGE);
      console.log(totalPage);
      if (totalPage > 1)
      loadMoreBtn.show();      
      return hits.reduce(
      (markup, hits) => markup + createMarkupList(hits),
      "")
    };
    } catch (err) {
      onError(err);
    }
}

async function loadMoreHitsMarkup() {
  loadMoreBtn.show();  
  const { hits, totalHits } = await newsApiService.getNews();
  // console.log(hits);
  // console.log(totalHits);    
  if (hits.length === 0) throw new Error("No data!");
  {
    totalPage -= 1;
    console.log(totalPage);
    if (totalPage === 1) endGalleryList();
    return hits.reduce(
      (markup, hits) => markup + createMarkupList(hits),
      ""
    )
  }
}

function createMarkupList({ webformatURL, largeImageURL,tags, likes, views, comments, downloads }) {  
  return `
  <div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}">  
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
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
  if (markup !== undefined)
    {refs.galleryList.insertAdjacentHTML("beforeend", markup);
    gallery.refresh();}
};

function clearGalleryList() {
  refs.galleryList.innerHTML = "";
}

function onError(err) {
  loadMoreBtn.hide();
  clearGalleryList();
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');  
};

function endGalleryList() {
  loadMoreBtn.hide();
  Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
};