import axios from 'axios';

export const imgPerPage = 40;

export async function getImages(query, page = 1) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '40334157-8af7e21c23f15ddda27e49965';
  
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: imgPerPage,
    });
  
    try {
      const response = await axios.get(`${BASE_URL}?${params}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw error;
    }
  }