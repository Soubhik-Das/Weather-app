const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const API_KEY='09a24f2ea3df47d99d825318241010'
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    let hour = time.getHours();
    const hoursIn12HrFormat = hour>=13?hour%12:hour
    const minute = time.getMinutes();
    const AmPm = hour >= 12 ? 'PM' : 'AM';
    const formattedMinute = minute < 10 ? '0' + minute : minute;

    timeEl.innerHTML = `${hoursIn12HrFormat}:${formattedMinute} <span id="am-pm">${AmPm}</span>`;
    dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

function getCurrentWeatherData() {
    navigator.geolocation.getCurrentPosition(
        (success) => {
            console.log(success);

            let { latitude, longitude } = success.coords;
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=09a24f2ea3df47d99d825318241010&q=${latitude},${longitude}&days=6&aqi=yes`)
                .then((res) => res.json())
                .then((data) => {
                    updateCurrentWeather(data,latitude,longitude)
                    FiveDayWeatherForecast(data)
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                });
        },
        (error) => {
            console.error("Error getting location:", error);
        }
    );
}
function updateCurrentWeather(data,lat,lon){
    const latitude=lat
    const longitude=lon
    console.log(data);
    currentWeatherItemsEl.innerHTML=`                
                   
        <div class="weather-item">
            <div id="humidty">Feels Like</div>
            <div>${data.current.feelslike_c+'&#176; C'}</div>
        </div>

            </div>
        <div class="weather-item">
            <div id="humidty">Humidity</div>
            <div>${data.current.humidity+'%'}</div>
        </div>
        <div class="weather-item">
            <div id="humidty">Pressure</div>
            <div>${data.current.pressure_in}</div>
        </div>
        <div class="weather-item">
            <div id="humidty">Wind Speed</div>
            <div>${data.current.wind_kph}</div>
        </div>`
    timeZone.innerHTML=`${data.location.name+'/'}${data.location.region}`
    countryEl.innerHTML=`${latitude}° N, ${longitude}° W`
}
function FiveDayWeatherForecast(data) {
    let otherDayForeCast = '';
    let currentDayForecast = '';

    data.forecast.forecastday.forEach((day, idx) => {
        const date = new Date(`${day.date}`);
        const dayin = date.getDay();
        const iconUrl = `https:${day.day.condition.icon}`;

        if (idx == 0) {            
            currentDayForecast = `
                <div class="today">
                    <img src="${iconUrl}" alt="weather-icon" class="w-icon">
                    <div class="other">
                        <div class="day">${daysShort[dayin]}</div>
                        <div class="temp">Day - ${day.day.maxtemp_c}&#176; C</div>
                        <div class="temp">Night - ${day.day.mintemp_c}&#176; C</div>
                    </div>
                </div>
            `;
            currentTempEl.innerHTML = currentDayForecast;
        }
        else {            
            otherDayForeCast += `
                <div class="weather-forecast-item">
                    <div class="day">${daysShort[dayin]}</div>
                    <img src="${iconUrl}" alt="weather-icon" class="w-icon">
                    <div class="temp">Day - ${day.day.maxtemp_c}&#176; C</div>
                    <div class="temp">Night - ${day.day.mintemp_c}&#176; C</div>
                </div>
            `;
        }
    });
    weatherForecastEl.innerHTML = otherDayForeCast;
}
getCurrentWeatherData();

