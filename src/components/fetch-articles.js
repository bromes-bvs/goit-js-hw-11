import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31515137-b1768032f7676aa2d663b226f';

export default async function fetchArticles(query, page) {
  const options = {
    params: {
      key: KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  };

  try {
    const response = await axios.get(`${BASE_URL}`, options);
    // console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
