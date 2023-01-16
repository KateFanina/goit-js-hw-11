const serchApiKey = '32843171-ff9144c309aed6563146cfd43';
const BASE_URL = 'https://pixabay.com/api/';
const ERROR_STATUS = 404;

export const fetchSearchImages = ({ imageName, page }) => {
  const searchImageName = imageName.replaceAll(' ', '+');
  const URL = `${BASE_URL}?key=${serchApiKey}&q=${searchImageName}&page=${page}&per_page=40
    &image_type=photo&orientation=horizontal&safesearch=true&webformatHeight=150`;
  return fetch(URL)
    .then(response => {
      if (response.status === ERROR_STATUS) {
        return Promise.reject();
      }
      return response.json();
    })
    .catch(() => Promise.reject());
};
