// renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const getWeatherBtn = document.getElementById('get-weather-btn');
  const cityInput = document.getElementById('city-input');
  const weatherResult = document.getElementById('weather-result');
  const sideTiles = document.getElementById('side-tiles');
  const locations = [
    'Moscow',
    'London',
    'Sydney',
  ];

  // Retrieve API key from the main process
  window.electron.getApiKey().then((API_KEY) => {
    getWeatherBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city === '') {
        weatherResult.innerHTML = 'Please enter a city name.';
        return;
      }

      fetchWeather(city, weatherResult, API_KEY);
    });

    function fetchWeather(city, element, API_KEY) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
          if (data.cod !== 200) {
            element.innerHTML = 'City not found. Please try again.';
            return;
          }

          const { main, name, weather, sys } = data;
          const icon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
          const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
          const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
          const weatherDescription = weather[0].main.toLowerCase();

          element.innerHTML = `
            <h2>${name}</h2>
            <img src="${icon}" alt="${weather[0].description}">
            <p>Temperature: ${main.temp} °C</p>
            <p>Weather: ${weather[0].description}</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
          `;

          setWeatherBackground(element, weatherDescription);
        })
        .catch(error => {
          element.innerHTML = 'Error fetching weather data. Please try again later.';
        });
    }

    function setWeatherBackground(element, weather) {
      let color;
      switch (weather) {
        case 'clear':
          color = '#ffeb3b'; // sunny
          break;
        case 'clouds':
          color = '#90a4ae'; // cloudy
          break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
          color = '#607d8b'; // rainy
          break;
        case 'snow':
          color = '#bbdefb'; // snowy
          break;
        default:
          color = '#b0bec5'; // default
          break;
      }
      element.style.backgroundColor = color;
    }

    // Clear existing tiles to prevent duplicates
    sideTiles.innerHTML = '';

    locations.forEach(location => {
      const tile = document.createElement('div');
      tile.classList.add('weather-tile');
      sideTiles.appendChild(tile);
      fetchWeather(location, tile, API_KEY);
    });
  });
});