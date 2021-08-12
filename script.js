const status = document.querySelector(".status");
const msg = document.querySelector(".msg");

/**
 * Converts celcius to Farenhit
 * @param {Number} temp temperature in celcius
 * @returns temperature in getFarenhit
 */
const getFarenhit = (temp) => temp * 1.8 + 32;

/**
 * Renders data for current weather
 * @param {Object} temp temp object
 * @param {Object} weather weather object
 * @param {String} unit either C of F
 */
// prettier-ignore
const renderData = (temp, weather, unit = "C") => {
    document.querySelector('.data').classList.remove("hidden");
    
    if (msg) msg.remove();
    
    const curWeather = document.querySelector(".weather");
    const curTemp = document.querySelector(".temp--cur");
    const maxTemp = document.querySelector(".temp--max");
    const minTemp = document.querySelector(".temp--min");
    const icon = document.querySelector(".icon")

    curWeather.textContent = weather.description;
    curTemp.textContent = `${unit == "F" ? getFarenhit(temp.temp) : temp.temp}  °${unit}`;
    maxTemp.textContent = `${unit == "F" ? getFarenhit(temp.temp_max) : temp.temp_max}  °${unit}`;
    minTemp.textContent = `${unit == "F" ? getFarenhit(temp.temp_min) : temp.temp_min}  °${unit}`;

    const imageURL = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    icon.setAttribute("src", imageURL);
};

/**
 * Gets weather data using openweathermap.org api
 * @param {Number} lat Latitude
 * @param {Number} lng Longitude
 */
// default location set to delhi
const getWeatherData = async (lat = 28.6139, lng = 77.209) => {
    const appid = "2ef97685757078b208fcd0cca5d8a280";
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${appid}&units=${unit}`;

    const res = await (await fetch(url)).json();

    const temp = res.main;
    const weather = res.weather[0];

    renderData(temp, weather);

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", function (e) {
            if (e.target.classList.contains("btn-f"))
                renderData(temp, weather, "F");
            if (e.target.classList.contains("btn-c")) renderData(temp, weather);
        });
    });
};

/**
 * Reverse Geocoding: retrieving address from coordinates
 * @param {Number} lat Latitude
 * @param {Number} lng Longitude
 * @param {Boolean} city true if geolocation accepted, else false
 */
const getAddress = async (lat = 28.6139, lng = 77.209, city = false) => {
    const token = "pk.4d2c3a1a382ce556a038444de6378789";
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${token}&lat=${lat}&lon=${lng}&format=json`;

    const res = await (await fetch(url)).json();
    const { address } = res;

    // console.log(res);
    // console.log(address);

    status.textContent = `${
        !city ? "Showing results for" : "Your location is at"
    } ${address.city ? address.city : address.road}, ${address.state}, ${
        address.country
    }`;
};

/**
 * Success callback for geolocation api
 * @param {Object} position position Object
 */
const success = function (position) {
    // console.log(position);

    const { latitude: lat, longitude: lng } = position.coords;

    if (lat && lng) {
        getAddress(lat, lng, true);
        getWeatherData(lat, lng);
    }
};

/**
 * Error callback for geolocation api
 */
const error = () => {
    status.textContent = "Unable to retrieve your location...";
    setTimeout(getAddress, 2000);
    setTimeout(getWeatherData, 2000);
};

/**
 * Activated when DOM is finished loading
 */
const init = function () {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        getAddress();
        getWeatherData();
    } else {
        status.textContent = "Locating...";
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
        });
    }
};

window.addEventListener("DOMContentLoaded", init);
