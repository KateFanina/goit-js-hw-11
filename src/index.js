import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchSearchImages } from './fetchSearchImages';

const searchForm = document.querySelector('.search-form');

const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;
async function onLoad(event) {
  try {
    const response = await fetchSearchImages({
      imageName: input.value,
      page: (page += 1),
    });
    const data = response.data;
    addImageNodes({
      images: data.hits,
      isOnLoad: true,
    });
    lightbox.refresh();
    if (data.totalHits === gallery.childElementCount) {
      loadMore.hidden = true;
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notify.failure('Opps something went wrong! Please try again later!');
  }
}

async function searchImages(event) {
  event.preventDefault();
  if (input.value) {
    page = 1;
    try {
      const response = await fetchSearchImages({
        imageName: input.value,
        page,
      });
      const data = response.data;
      if (!data?.hits?.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
        return;
      }
      addImageNodes({ images: data.hits });
      loadMore.hidden = false;
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      lightbox.refresh();
    } catch (error) {
      Notify.failure('Opps something went wrong! Please try again later!');
    }
  }
}
loadMore.addEventListener('click', onLoad);
searchForm.addEventListener('submit', searchImages);

const addImageNodes = ({ images, isOnLoad }) => {
  const markup = images
    .map(
      image =>
        `<div class="photo-card" rel="stylesheet"  href="style.css">
          <a data-type="image" class="gallery__item" href="${image.largeImageURL}">
            <img class="gallery__image"
              alt="${image.tags}"
              data-source="${image.largeImageURL}"
              loading="lazy"
              src="${image.webformatURL}"
              width="250"
              
            />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span class="span">${image.likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span class="span">${image.views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span class="span">${image.comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span class="span">${image.downloads}</span>
            </p>
          </div>
        </div>`
    )
    .join('');
  if (isOnLoad) {
    gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    gallery.innerHTML = markup;
  }
};

gallery.addEventListener('click', openImage);

function openImage(event) {
  event.preventDefault();
  console.log('event_opem_img', event);
  if (event.target.nodeName !== 'IMG') {
    return;
  }
}
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});
