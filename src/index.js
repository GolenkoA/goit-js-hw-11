import './css/styles.css';
import SearchPixabayAPI from './js/pixabay-service.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { throttle } from 'throttle-debounce';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const formEl = document.querySelector('#search-form');
const galleryContent = document.querySelector('.gallery');

formEl.addEventListener('submit', searchQuery);


const lightboxGallery = new SimpleLightbox('.gallery a');
const searchAPI = new SearchPixabayAPI()

async function searchQuery(event) {
    event.preventDefault();
    galleryContent.innerHTML = '';
    searchAPI.query = event.currentTarget.elements.searchQuery.value.trim();
    // console.log(searchAPI.query);
    searchAPI.removePage();

    try {
        if (!searchAPI.query) {
            refs.gallery.innerHTML = ''
            Notify.failure('Sorry, enter the query')
          return;
        }
        const response = await searchAPI.getImages()

        if (response.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        } else {
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
            renderGallery(response.hits)
        }
    } catch (error) {
        console.log(error);
    }

 };

 function renderGallery(images) {
    const markup = images
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
                    <a class="photo-link" href="${largeImageURL}">  
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </a>
                    <div class="info">
                      <p class="info-item">
                        <b>Likes</b> ${likes}
                      </p>
                      <p class="info-item">
                        <b>Views</b> ${views}
                      </p>
                      <p class="info-item">
                        <b>Comments</b> ${comments}
                      </p>
                      <p class="info-item">
                        <b>Downloads</b> ${downloads}
                      </p>
                    </div>
                </div>`
        }).join('')
    galleryContent.insertAdjacentHTML('beforeend', markup)
  lightboxGallery.refresh()
}

window.addEventListener('scroll', throttle(200, infiniteScroll));

async function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (documentRect.bottom < document.documentElement.clientHeight + 100) {
    try {
      const response = await searchAPI.getImages();
      renderGallery(response.hits);
      smoothScroll();
    } catch (error) {
      Notify.info('We are sorry, but you have reached the end of search results.');
      return;
    }
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
  });
}