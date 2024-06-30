document.addEventListener('DOMContentLoaded', () => {
  // DOM element references
  const getWeatherBtn = document.getElementById('get-weather-btn');
  const cityInput = document.getElementById('city-input');
  const weatherResult = document.getElementById('weather-result');
  const sideTiles = document.getElementById('side-tiles');

  // List of locations to display weather tiles for
  const locations = [
    'Moscow',
    'London',
    'Sydney',
  ];

  // Retrieve API key from the main process
  window.electron.getApiKey().then((API_KEY) => {
    // Event listener for the "Get Weather" button
    getWeatherBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city === '') {
        weatherResult.innerHTML = 'Please enter a city name.';
        return;
      }

      // Fetch weather data for the specified city
      fetchWeather(city, weatherResult, API_KEY);
    });

    // Function to fetch weather data from the API
    function fetchWeather(city, element, API_KEY) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
          if (data.cod !== 200) {
            element.innerHTML = 'City not found. Please try again.';
            return;
          }

          // Extract relevant data from the API response
          const { main, name, weather, sys, timezone } = data;
          const icon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
          const sunrise = convertToLocalTime(sys.sunrise, timezone);
          const sunset = convertToLocalTime(sys.sunset, timezone);
          const weatherDescription = weather[0].main.toLowerCase();

          // Update the weather result element with the retrieved data
          element.innerHTML = `
            <h2>${name}</h2>
            <img src="${icon}" alt="${weather[0].description}">
            <p>Temperature: ${main.temp} °C</p>
            <p>Weather: ${weather[0].description}</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
          `;

          // Set the background color based on the weather description
          setWeatherBackground(element, weatherDescription);
        })
        .catch(error => {
          console.error(error);
          element.innerHTML = 'Error fetching weather data. Please try again later.';
        });
    }

    // Function to convert Unix timestamp to local time
    function convertToLocalTime(unixTimestamp, timezoneOffset) {
      return window.moment.format(unixTimestamp, timezoneOffset / 60, 'HH:mm:ss');
    }

    // Function to set the weather background color based on the weather description
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

    // Fetch weather data for each location and create weather tiles
    locations.forEach(location => {
      const tile = document.createElement('div');
      tile.classList.add('weather-tile');
      sideTiles.appendChild(tile);
      fetchWeather(location, tile, API_KEY);
    });
  });
});
