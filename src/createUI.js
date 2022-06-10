const key = "citiesNames";

//The function of getting a map by coordinates using static Yandex maps
export function getMap(el, lat, lon) {
  let mapImg;
  if (lat === "notFound" || lon === "notFound") {
    //mapImg = 'https://picsum.photos/picsum/500/300';
    mapImg = "https://picsum.photos/id/1025/500/300";
  } else {
    mapImg = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=10&l=map`;
  }
  const divMap = el.querySelector(".map");
  divMap.style.backgroundImage = `url(${mapImg})`;
}

//The function of reading the list of saved cities from the local storage
async function readList() {
  let values = localStorage.getItem(key);
  return values === null ? [] : JSON.parse(values);
}

//The function of saving the list of entered cities in the local storage
function saveList(items) {
  localStorage.setItem(key, JSON.stringify(items));
}

// The function for drawing a list of entered cities
function drawList(el, items) {
  const ol = el.querySelector("ol");
  ol.innerHTML = `${items.map((el) => `<li>${el}</li>`).join("")}`;
}

//Function for rendering the weather on the page
async function showWeather(el, weatherInfo) {
  el.querySelector("table").remove();
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  let title = document.createElement("tr");
  let heading1 = document.createElement("th");
  heading1.innerHTML = "Город";
  let heading2 = document.createElement("th");
  heading2.innerHTML = "Температура";
  let heading3 = document.createElement("th");
  heading3.innerHTML = "Изображение";
  let heading4 = document.createElement("th");
  heading4.innerHTML = "Широта";
  let heading5 = document.createElement("th");
  heading5.innerHTML = "Долгота";

  title.appendChild(heading1);
  title.appendChild(heading2);
  title.appendChild(heading3);
  title.appendChild(heading4);
  title.appendChild(heading5);
  thead.appendChild(title);

  const j = weatherInfo;

  let row = document.createElement("tr");

  let row_data_1 = document.createElement("td");
  row_data_1.className = "cityName";
  row_data_1.innerHTML = `${j.name}`;

  let row_data_2 = document.createElement("td");
  row_data_2.className = "temp";
  row_data_2.innerHTML = `${j.main.temp} С`;

  let row_data_3 = document.createElement("td");
  row_data_3.className = "icon";
  row_data_3.innerHTML = `<img src="http://openweathermap.org/img/wn/${j.weather[0].icon}@2x.png">`;

  let row_data_4 = document.createElement("td");
  row_data_4.innerHTML = `${j.coord.lat}`;
  row_data_4.className = "lat";

  let row_data_5 = document.createElement("td");
  row_data_5.innerHTML = `${j.coord.lon}`;
  row_data_5.className = "lon";

  row.appendChild(row_data_1);
  row.appendChild(row_data_2);
  row.appendChild(row_data_3);
  row.appendChild(row_data_4);
  row.appendChild(row_data_5);
  tbody.appendChild(row);

  el.appendChild(table);
}

//Function for getting weather data by city name
async function getWeather(cityName) {
  const appId = "2597ebe4fdf3e724b73c766fb984c2fb";
  const url = `http://api.openweathermap.org/data/2.5/weather?units=metric&q=
  ${cityName}&appid=${appId}`;
  let response = await fetch(url);
  let status = response.status;
  if (status !== 200)
    return {
      name: cityName,
      main: {
        temp: "notFound",
      },
      weather: [{ icon: "https://picsum.photos/seed/picsum/10/300" }],
      coord: {
        lat: "notFound",
        lon: "notFound",
      },
    };
  let json = await response.json();
  return json;
}

//The function of obtaining the coordinates of the location by the user's IP address
async function getIP() {
  const url = "http://ipwho.is/";
  let response = await fetch(url);
  let json = await response.json();
  return {
    name: json.city,
    coord: { lat: json.latitude, lon: json.longitude },
  };
}

//Markup creation function
function createElements(el) {
  const divYourWeatherInfo = document.createElement("div");
  divYourWeatherInfo.className = "yourWeatherInfo";

  const yourTable = document.createElement("table");
  yourTable.className = "youWeatherTable";
  divYourWeatherInfo.appendChild(yourTable);

  const label1 = document.createElement("label");
  label1.className = "label";
  label1.innerText = "Карта";
  label1.setAttribute("for", divYourWeatherInfo.className);
  divYourWeatherInfo.appendChild(label1);

  const divMap = document.createElement("div");
  divMap.className = "map";
  divYourWeatherInfo.appendChild(divMap);

  el.appendChild(divYourWeatherInfo);

  const divContainer = document.createElement("div");
  divContainer.className = "container";

  const ol = document.createElement("ol");
  ol.className = "citiesList";
  ol.placeholder = "Список городов";

  const divWeatherInfo = document.createElement("div");
  divWeatherInfo.className = "weatherInfo";

  const label2 = document.createElement("label");
  label2.className = "label";
  label2.id = "label2";
  label2.innerText = "Ваш список городов";
  label2.setAttribute("for", divWeatherInfo.className);
  label2.hidden = "true";
  divWeatherInfo.appendChild(label2);

  const cityWeatherTable = document.createElement("table");
  cityWeatherTable.className = "cityWeatherTable";
  divWeatherInfo.appendChild(cityWeatherTable);
  divContainer.appendChild(divWeatherInfo);
  divContainer.appendChild(ol);
  el.appendChild(divContainer);

  const formEl = document.createElement("form");
  formEl.className = "myForm";

  const inp = document.createElement("input");
  inp.className = "userInput";
  inp.placeholder = "Type city and press enter";
  formEl.appendChild(inp);

  const btn = document.createElement("button");
  btn.className = "userButton";
  btn.innerText = "Get weather";
  formEl.appendChild(btn);
  el.appendChild(formEl);

  return el;
}

//main function
async function createUI(el) {
  el = createElements(el);

  //determining the location coordinates by IP
  const yourParameters = await getIP();
  const yourCitiName = yourParameters.name;
  const coord = yourParameters.coord;

  //getting weather by city name
  const yourWeather = await getWeather(yourCitiName);

  //weather display on the page
  await showWeather(el.querySelector(".yourWeatherInfo"), yourWeather);

  //reading the list of saved cities
  const items = await readList();

  //reading the list of saved cities
  drawList(el.querySelector(".container"), items);

  //get map
  getMap(el, coord.lat, coord.lon);

  //handler for interaction with the form - input elements and buttons
  el.querySelector(".myForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();

    //reading the value from the form-input
    const formElement = ev.target;
    const inputEl = formElement.querySelector("input");
    const cityName = inputEl.value;
    inputEl.value = "";

    //checking the entered city for its presence in the list of saved cities
    let result = items.reduce(function (res, el) {
      if (el === cityName) {
        res = true;
        return res;
      }
      return res;
    }, false);

    //if the entered city is not in the saved list, then add it
    if (!result) items.push(cityName);

    //the list can contain only 10 cities. if the 11th city is entered,
    //then the first one from the list is deleted
    items.splice(items, items.length - 10);

    //drawing a list of saved cities
    drawList(el.querySelector(".container"), items);

    //saving the modified list of cities to local storage
    saveList(items);

    //getting the weather for the entered city
    const weather = await getWeather(cityName);

    //rendering the weather of the entered city
    await showWeather(el.querySelector(".weatherInfo"), weather);

    //getting a map of the entered city
    getMap(el, weather.coord.lat, weather.coord.lon);
  });

  //click handler for the list of saved cities
  el.querySelector("ol").addEventListener("click", async (ev) => {
    ev.preventDefault();
    const li = ev.target;
    const cityName = li.innerHTML;

    //getting the weather for the clicked city
    const weather = await getWeather(cityName);

    //rendering the clicked city on the weather form
    await showWeather(el.querySelector(".weatherInfo"), weather);
    const label2 = document.querySelector("#label2");
    label2.innerText = "Погода в выбранном городе";

    //getting the weather of the clicked city
    getMap(el, weather.coord.lat, weather.coord.lon);
  });
}
export { getIP, getWeather, createUI, readList };
