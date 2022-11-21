import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './components/fetchCountries';
import manyCountriesTpl from './templates/many-countries-markup.hbs';
import countryTpl from './templates/country-markup.hbs';

const DEBOUNCE_DELAY = 300;

const inputElem = document.querySelector('#search-box');
const countryListElem = document.querySelector('.country-list');
const countryInfoElem = document.querySelector('.country-info');

inputElem.addEventListener(
  'input',
  debounce(handelSearchCountry, DEBOUNCE_DELAY)
);

function handelSearchCountry(event) {
  event.preventDefault();
  //   console.log(event.target.value);

  const inputValue = event.target.value.trim();

  if (!inputValue) {
    countryInfoElem.innerHTML = '';
    countryListElem.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if ((data.length >= 2) & (data.length <= 10)) {
        // console.log(data);
        countryInfoElem.innerHTML = '';
        renderCountriesCards(data);
      }
      if (data.length === 1) {
        // console.log(data);
        renderCountryCard(data);
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountriesCards(countries) {
  const markup = manyCountriesTpl(countries);
  countryInfoElem.innerHTML = '';
  countryListElem.innerHTML = markup;
}

function renderCountryCard(country) {
  //   console.log(country[0].languages);

  country[0].languages = Object.values(country[0].languages).join(', ');
  const markup = countryTpl(country[0]);
  countryListElem.innerHTML = '';
  countryInfoElem.innerHTML = markup;
}
