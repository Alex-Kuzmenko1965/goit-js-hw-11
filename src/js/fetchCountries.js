const ENDPOINT = "https://restcountries.com/v3.1";

function fetchCountries(name) {
  return fetch(`${ENDPOINT}/name/${name}?fields=flags,name,capital,population,languages`).then((data) =>
    data.json()
  );
};

export { fetchCountries };

fetch(`${ENDPOINT}/name/sw?fields=flags,name,capital,population,languages`)
  .then((data) => data.json())
  .then((data) => console.log(data));
