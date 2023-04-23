export default class NewsApiService {
static ENDPOINT = "https://pixabay.com/api/";
static API_KEY = "35625970-89038dd523b582e6c8e1b8881";

constructor() {
  this.query = "";
  this.page = 1;
}

async getNews() {
  const url = `${NewsApiService.ENDPOINT}?key=${NewsApiService.API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
  console.log(url);

  const { data } = await axios.get(url);
  console.log(await axios.get(url));
  console.log(data);    
  this.incrementPage();

  return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

// fetch(`https://pixabay.com/api/?key=35625970-89038dd523b582e6c8e1b8881&q=cat&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=3`)
//   .then((data) => data.json())
//   .then(({ hits, totalHits }) => {
//     console.log(hits);
//     console.log(totalHits)
//   });
