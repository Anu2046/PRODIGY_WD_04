const apiKey = '4491850a12c7b1444bd8115ca6c84875';


document.getElementById('location-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    getWeatherByLocation(location);
});


document.getElementById('current-location-btn').addEventListener('click', function() {
    getWeatherByCurrentLocation();
});


function getWeatherByLocation(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return Promise.reject('Location not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data for location:', data);
            displayWeather(data);
        })
        .catch(error => {
            alert('Error fetching weather data: ' + error);
        });
}


function getWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return Promise.reject('Unable to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data for coordinates:', data);
            displayWeather(data);
        })
        .catch(error => {
            alert('Error fetching weather data: ' + error);
        });
}


function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log('Current position:', latitude, longitude);
            console.log('Location accuracy (meters):', accuracy);
            getWeatherByCoords(latitude, longitude);
        }, error => {
            alert('Error fetching current location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}


function displayWeather(data) {
    console.log(data); 

 
    document.getElementById('weather-result').style.display = 'block';
    document.getElementById('location-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const timestamp = data.dt;
    const timezoneOffset = data.timezone;
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    const hours = localTime.getUTCHours();

    const isDaytime = hours >= 6 && hours < 18;

    const weatherCondition = data.weather[0].main.toLowerCase();
    const body = document.body;

    if (isDaytime) {
        switch (weatherCondition) {
            case 'clear':
                body.style.backgroundImage = "url('day_clear.jpg')";
                break;
            case 'clouds':
                body.style.backgroundImage = "url('day_cloud.jpg')";
                break;
            case 'thunderstorm':
            case 'rain':
            case 'drizzle':
                body.style.backgroundImage = "url('day_rainy1.gif')";
                break;
            case 'snow':
                body.style.backgroundImage = "url('day_snowy.jpeg')";
                break;
            case 'haze':
                body.style.backgroundImage = "url('day_haze.jpg')";
                break;
            case 'mist':
                body.style.backgroundImage = "url('day_mist.jpg')";
                break;
            default:
                body.style.backgroundImage = "url('default.avif')";
        }
    } else {
        switch (weatherCondition) {
            case 'clear':
                body.style.backgroundImage = "url('night_clear.jpg')";
                break;
            case 'clouds':
                body.style.backgroundImage = "url('night_cloudy.jpg')";
                break;
            case 'thunderstorm':
            case 'rain':
            case 'drizzle':
                body.style.backgroundImage = "url('night_rainy.gif')";
                break;
            case 'snow':
                body.style.backgroundImage = "url('night_snowy1.gif')";
                break;
            case 'haze':
            case 'mist':
                body.style.backgroundImage = "url('night_haze.png')";
                break;
            default:
                body.style.backgroundImage = "url('night_default.jpg')";
        }
    }
}
