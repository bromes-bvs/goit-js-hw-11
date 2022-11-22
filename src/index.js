import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import fetchArticles from './components/fetch-articles';
import cardsTpl from './templates/cards-template.hbs';

const formElem = document.querySelector('#search-form');
const loadMoreBtnElem = document.querySelector('.load-more');
const galleryElem = document.querySelector('.gallery');

formElem.addEventListener('submit', handleSearch);
loadMoreBtnElem.addEventListener('click', handleLoadMoreClick);

let searchValue = '';
let page = 0;
let simpleLightbox;
loadMoreBtnElem.style.display = 'none';

function handleSearch(event) {
  event.preventDefault();
  galleryElem.innerHTML = '';
  searchValue = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  // console.log(searchValue);

  if (!searchValue) {
    Notiflix.Notify.info('Please enter something');
    galleryElem.innerHTML = '';
    loadMoreBtnElem.style.display = 'none';
    return;
  }

  fetchArticles(searchValue, page).then(({ hits, totalHits }) => {
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    renderArticles(hits);

    simpleLightbox = new SimpleLightbox('.gallery .photo-card a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    page += 1;
    loadMoreBtnElem.style.display = 'inline-block';
  });
}

function handleLoadMoreClick() {
  fetchArticles(searchValue, page).then(({ hits }) => {
    renderArticles(hits);

    page += 1;
    simpleLightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function renderArticles(articles) {
  // console.log(articles);

  const markup = cardsTpl(articles);
  if (!articles.length) {
    return;
  }
  if (articles.length < 40 && articles.length !== 0) {
    loadMoreBtnElem.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  galleryElem.insertAdjacentHTML('beforeend', markup);
}
