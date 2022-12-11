import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debonce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const inputHandler = event => {
  const searchString = event.target.value.trim();
  clearResult();
  if (searchString.length > 0) {
    fetchCountries(searchString).then(result => {
      showResult(result);
    });
  }
};

function showResult(values = []) {
  const arrLength = values.length;
  if (arrLength === 1) showCountryInfo(values[0]);
  else if (arrLength > 1 && arrLength <= 10) showCountriesList(values);
  else if (arrLength > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function showCountryInfo(country) {
  countryInfo.innerHTML = '';

  const lang = Object.values(country.languages).join(',');
  const markup = `<p class='country-info__name'><img src='${country.flags.svg}' alt='Flag of ${country.name.official}' width=36 height=36> ${country.name.official}</p><p><strong>Capital:</strong> ${country.capital}</p><p><strong>Population:</strong> ${country.population}</p><p><strong>Languages:</strong> ${lang}</p>`;
  countryInfo.insertAdjacentHTML('afterbegin', markup);
  countryList.classList.add('is-hidden');
  countryInfo.classList.remove('is-hidden');
}
function showCountriesList(countriesList) {
  const markup = countriesList
    .map(country => {
      return `<li class='country-list__item'><img src='${country.flags.svg}' alt='Flag of ${country.name.official}'  width=30 height=30>${country.name.official}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('afterbegin', markup);
  countryList.classList.remove('is-hidden');
  countryInfo.classList.add('is-hidden');
}

function clearResult() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function addStyleSheetRules() {
  const styles = [
    '.country-list {list-style: none;padding: 0;margin:0;font-size:20px}',
    '.country-list__item {display: flex;align-items: center;gap: 10px;}',
    '.country-list__item:not(:last-child) {margin-bottom: 2px;}',
    '.country-info__name {font-weight: 700;font-size: 36px;display: flex;align-items: center;gap: 10px;}',
    '.country-info * {margin:10px 0;}',
    '.is-hidden {display:none;}',
    '#search-box {border-radius:5px;}',

    '#search-box:active,#search-box:focus {outline:none;border-color:blue;}',
  ];

  const styleEl = document.createElement('style');

  // Append <style> element to <head>
  document.head.appendChild(styleEl);

  // Grab style element's sheet
  const styleSheet = styleEl.sheet;

  for (const st of styles) {
    styleSheet.insertRule(st);
  }
}

function init() {
  countryList.classList.add('is-hidden');
  countryInfo.classList.add('is-hidden');
}

inputSearchBox.addEventListener('input', debonce(inputHandler, DEBOUNCE_DELAY));
addStyleSheetRules();
init();
