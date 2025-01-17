const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");

const data = {
  key: "69c1b37d68805b21d106af47d4a3cf5f",
  base: "https://api.openweathermap.org/data/2.5/",
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);
//user location's  current and 7 days forcast weather data
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  alert("Browser doesn't Support Geolocation.");
  throw new Error("Browser doesn't Support Geolocation.");
}

function setPosition(position) {
  // Process the position information here
  console.log("Latitude:", position.coords.latitude);
  console.log("Longitude:", position.coords.longitude);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function getWeatherData(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${data.key}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showWeatherData(data);
    });
}

function showWeatherData(data) {
  // Assuming timezone and lat/lon are properties of data
  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = `${data.lat}N ${data.lon}E`;

  let otherDayForecast = "";
  // Iterate through daily forecasts, skipping the first one (index 0)
  data.daily.forEach((day, idx) => {
    if (idx !== 0) {
      // Ensure index is not 0
      otherDayForecast += `
        <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img src="http://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png" alt="weather icon" class="w-icon">
          <div class="temp">Night - ${day.temp.night.toFixed(1)} &#176;C</div>
          <div class="temp">Day - ${day.temp.day.toFixed(1)} &#176;C</div>
          <div class="humid">Humidity - ${day.humidity} %</div>
          <div class="wcondition">Condition - ${day.weather[0].main}</div>
        </div>
      `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;
}

let weather = {
  apiKey: "44f477ffad31bb86518baf3ab37b601f",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity, temp_min, temp_max } = data.main;
    const { speed } = data.wind;
    const lon = Math.floor(data.coord.lon);
    const lat = Math.floor(data.coord.lat);

    getWeatherData(lat, lon);
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = Math.round(temp) + " °C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + " %";
    document.querySelector(".wind").innerText =
      "Wind Speed: " + speed + " km/h";
    document.querySelector(".search-box").classList.remove("loading");
    document.querySelector(".others").innerText =
      "Temp-Range : " +
      Math.round(temp_min) +
      " °C / " +
      Math.round(temp_max) +
      " °C";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search").value);
  },
};

document.querySelector(".btn").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});
weather.fetchWeather("New Delhi");

function getData2(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${data.key}`
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => this.displayData2(data));
}

function displayData2(data) {
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity, temp_min, temp_max } = data.main;
  const { speed } = data.wind;

  const lon = Math.floor(data.coord.lon);
  const lat = Math.floor(data.coord.lat);

  getWeatherData(lat, lon);

  document.querySelector(".city").innerText = "Weather in " + name;
  document.querySelector(".icon").src =
    "https://openweathermap.org/img/wn/" + icon + ".png";
  document.querySelector(".description").innerText = description;
  document.querySelector(".temp").innerText = Math.round(temp) + " °C";

  document.querySelector(".humidity").innerText =
    "Humidity: " + humidity + " %";
  document.querySelector(".wind").innerText = "Wind Speed: " + speed + " km/h";
  document.querySelector(".search-box").classList.remove("loading");
  document.querySelector(".others").innerText =
    "Temp-Range : " +
    Math.round(temp_min) +
    " °C / " +
    Math.round(temp_max) +
    " °C";
}
