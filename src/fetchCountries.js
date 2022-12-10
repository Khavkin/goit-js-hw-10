import { Notify } from 'notiflix';

const siteURL = 'https://restcountries.com/v3.1/name/';
const selectedFields = ['name', 'capital', 'population', 'flags', 'languages'];

const makeQueryString = searchString => {
  const paramStr =
    selectedFields.length > 0 ? '?fields=' + selectedFields.join(',') : '';
  return `${siteURL}${searchString}${paramStr}`;
};
function fetchCountries(searchString) {
  const path = makeQueryString(searchString);

  return new Promise((resolve, reject) => {
    fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Oops, there is no country with that name'
              : response.status
          );
        }
        resolve(response.json());
      })
      .catch(error => {
        Notify.failure(error.message);
        reject(error.message);
      });
  });
}

export { fetchCountries };
