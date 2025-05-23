// let API_URI = 'https://garment002.pythonanywhere.com/';
// let API_URI = 'http://127.0.0.1:8000';
let API_URI = 'https://retailplush001.pythonanywhere.com/';
if (process.env.NODE_ENV === 'development') {
  // API_URI = 'http://127.0.0.1:8000';
  API_URI = 'https://retailplush001.pythonanywhere.com/';
}
export const API_BASE_URL = API_URI;
