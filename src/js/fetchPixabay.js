// export default class NewsApiService {
//   static ENDPOINT = "https://pixabay.com/api/";
//   static API_KEY = "35625970-89038dd523b582e6c8e1b8881";

//   constructor() {
//     this.query = "";    
//   }

const ENDPOINT = "https://pixabay.com/api/";
const API_KEY = "35625970-89038dd523b582e6c8e1b8881";
const query = "123";

async function fetchPixabay(query) {
  const response = await fetch(`${ENDPOINT}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
  const data = await response.json();  
  console.log(data);
  return data;
};

export { fetchPixabay };

fetch(`${ENDPOINT}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
  .then((data) => data.json())
  .then(({ hits }) => console.log(hits));
