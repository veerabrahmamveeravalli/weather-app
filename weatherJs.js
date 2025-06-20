const weatherForm = document.querySelector('.weatherform');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apikey = "e77156cb7d5c3f9bb495456202b7fb1e";

weatherForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        try{
            const weatherData = await getWeather(city);
            displayWeatherInfo(weatherData);
        }
        catch (error) {
            console.error("Error fetching weather data:", error);
            showError("Failed to fetch weather data. Please try again later.");
        }
        //getWeather(city);
    } else {
        showError("Please enter a city");
    }
});

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
    

}




function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity, temp_min, temp_max },
        weather: [ { description, id } ],
        wind: { speed },
        timezone
    } = data;

    document.querySelector('.errorMessage').textContent = '';
    card.style.display = 'flex'; // <- fix: use 'flex' instead of 'block'

    const windMph = (speed * 2.23694).toFixed(1); // Convert m/s to mph

    const nowUTC = new Date().getTime();
    const localTime = new Date(nowUTC + (timezone * 1000));
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    };
    const dateOptions = {
        month: 'short',
        day: '2-digit',
        weekday: 'short',
        year: 'numeric',
        timeZone: 'UTC'
    };    
    const timeStr = localTime.toLocaleTimeString('en-US', timeOptions);
    const dateParts = localTime.toLocaleDateString('en-US', dateOptions).split(', ');
    const formattedDateTime = `${timeStr}, ${dateParts[1]}, ${dateParts[0]}, ${dateParts[2]}`;


    document.querySelector('.cityDisplay').textContent = city;
    document.querySelector('.tempDisplay').textContent = `${Math.round(temp)}°C`;
    document.querySelector('.humidityDisplay').textContent = `Humidity: ${humidity}%`;
    document.querySelector('.descDisplay').textContent = description;
    document.querySelector('.windDisplay').textContent = `Wind: ${windMph} mph`;
    document.querySelector('.weatherEmoji').textContent = getWeatherEmoji(id);

    // Add local time display
    let dateTimeElement = document.querySelector('.dateTimeDisplay');
    if (!dateTimeElement) {
        dateTimeElement = document.createElement('p');
        dateTimeElement.classList.add('dateTimeDisplay');
        card.appendChild(dateTimeElement);
    }
    dateTimeElement.textContent = formattedDateTime;
    // Add temp range display
    let tempRangeElement = document.querySelector('.tempRangeDisplay');
    if (!tempRangeElement) {
        tempRangeElement = document.createElement('p');
        tempRangeElement.classList.add('tempRangeDisplay');
        card.appendChild(tempRangeElement);
    }
    tempRangeElement.innerHTML = `<strong> H: ${Math.round(temp_max)}°C   L: ${Math.round(temp_min)}°C </strong>`;
}

function getWeatherEmoji(id) {
    switch(true) {
        case (id >= 200 && id < 300):
            return '⛈️'; // Thunderstorm
        case (id >= 300 && id < 500):
            return '🌧️'; // Drizzle
        case (id >= 500 && id < 600):
            return '🌧️'; // Rain
        case (id >= 600 && id < 700):
            return '❄️'; // Snow
        case (id >= 700 && id < 800):
            return '🌫️'; // Atmosphere
        case (id === 800):
            return '☀️'; // Clear
        case (id > 800 && id < 900):
            return '☁️'; // Clouds
        default:
            return '❓'; // Unknown weather
    }

}
function showError(message) {
    /*
    const errorMessage = document.querySelector('.errorMessage');
    errorMessage.textContent = message;
    //errorMessage.classList.add('errorMessage');
    //card.textContent = ''; // Clear previous weather info
    card.style.display = 'flex';
    //card.appendChild(errorMessage);
    */
    const errorMessage = document.querySelector('.errorMessage');
    errorMessage.textContent = message;

    document.querySelector('.cityDisplay').textContent = '';
    document.querySelector('.tempDisplay').textContent = '';
    document.querySelector('.humidityDisplay').textContent = '';
    document.querySelector('.descDisplay').textContent = '';
    document.querySelector('.windDisplay').textContent = '';
    document.querySelector('.weatherEmoji').textContent = '';

    const dateTimeElement = document.querySelector('.dateTimeDisplay');
    if (dateTimeElement) dateTimeElement.textContent = '';

    const tempRangeElement = document.querySelector('.tempRangeDisplay');
    if (tempRangeElement) tempRangeElement.textContent = '';
    card.style.display = 'flex';  // Show the card
}