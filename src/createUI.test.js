import { createUI, readList } from "./createUI.js";

describe("Inspect CreateUI function", () => {
  let body;
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    body = document.createElement("body");

    global.fetch = () =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            city: "Pyra",
            name: "Pyra",
            latitude: 56.3132731,
            longitude: 43.3604986,
            coord: {
              lon: 43.3527,
              lat: 56.2953,
            },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            main: {
              temp: 290.77,
              feels_like: 290.15,
              temp_min: 290.77,
              temp_max: 290.99,
              pressure: 1013,
              humidity: 60,
              sea_level: 1013,
              grnd_level: 1001,
            },
          }),
        status: 200,
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it("is a function", () => {
    expect(createUI).toBeInstanceOf(Function);
  });

  it("check yourWeather", async () => {
    await createUI(body);

    const userWeatherParams = await (await fetch()).json();

    const table = body.querySelector("table");
    const tbody = table.querySelector("tbody");
    const tr = tbody.querySelector("tr");
    const tdcityName = tr.querySelector(".cityName");
    const cityName = tdcityName.innerHTML;

    const tdTemp = tr.querySelector(".temp");
    const temp = tdTemp.innerHTML;

    const tdLat = tr.querySelector(".lat");
    const lat = tdLat.innerHTML;

    const tdLon = tr.querySelector(".lon");
    const lon = tdLon.innerHTML;

    expect(cityName).toEqual(userWeatherParams.city);
    expect(temp).toEqual(`${userWeatherParams.main.temp} С`);
    expect(Number(lat)).toEqual(userWeatherParams.coord.lat);
    expect(Number(lon)).toEqual(userWeatherParams.coord.lon);
  });

  it("check add new list elements", async () => {
    await createUI(body);
    const form = body.querySelector("form");
    const input = body.querySelector(".userInput");
    input.value = "Petersburg";

    const value = input.value;
    form.submit();

    const li = body.querySelector("li");
    expect(value).toEqual(li.innerHTML);
  });

  it("check count of list elements", async () => {
    const items = [
      "samara",
      "berlin",
      "kiev",
      "moscow",
      "pekin",
      "omsk",
      "london",
    ];

    const key = "citiesNames";
    localStorage.setItem(key, JSON.stringify(items));

    await createUI(body);

    const li = body.querySelectorAll("li");
    expect(items.length).toEqual(li.length);
  });

  it("check add existing element of list elements", async () => {
    const items = ["samara", "berlin", "moscow", "pekin", "omsk", "london"];

    const key = "citiesNames";
    localStorage.setItem(key, JSON.stringify(items));

    await createUI(body);

    const form = body.querySelector("form");
    const input = body.querySelector(".userInput");
    input.value = "samara";

    form.submit();

    const li = body.querySelectorAll("li");
    expect(items.length).toEqual(li.length);
  });

  it("check read list elements", async () => {
    const items = ["samara", "berlin", "moscow", "pekin", "omsk", "london"];

    const key = "citiesNames";
    localStorage.setItem(key, JSON.stringify(items));
    const itemsRead = await readList();

    expect(items.length).toEqual(itemsRead.length);
  });
});
