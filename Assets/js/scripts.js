var APIKey = "021b34237bbcc96949e3a99359d6328e";

//current date
const today = moment().format("L");
let DateEL = document.querySelector("#current-date");

//input city elements 
var cityInputEL = document.querySelector("#enterCity");
var saveCityButton = document.querySelector("#searchBtn");
var searchHistoryEl = document.getElementById("searchHistory");
//various elements for city information 
var currentNameCity = document.querySelector('#current-name');
var currentCityDetailEL = document.querySelector('#cityDetail');
var currentCity = document.querySelector('#current-city');
var uvCondition = document.querySelector('#uv-condition');
var fiveDayCardEl = document.querySelector('#forecast_card');

// need to define extra city in order for city to pass through functions
let theCity;

//local storage 
var searchHistoryList =
    JSON.parse(window.localStorage.getItem("newCity")) || [];

//save city object
function saveCity(city) {
    //get value from input box
    console.log("saveCity function");
    theCity = city;
    var newCity = {
        city,
    };
    searchHistoryList.push(newCity);
    window.localStorage.setItem("newCity", JSON.stringify(searchHistoryList));

};




//display search history of cities 
function displaySearchHistory() {
    console.log('displaySearchHistory');

    // display on page
    searchHistoryEl.textContent = "";
    searchHistoryList.forEach(function ({
        city
    }) {
        // create li tag for each item
        let cityButtonEl = document.createElement("button");
        cityButtonEl.setAttribute("class", "list-group-item");
        cityButtonEl.setAttribute("data-id", `${city}`);
        cityButtonEl.textContent = city;
        searchHistoryEl.appendChild(cityButtonEl);

    });
};

//user should be able to click on users from search history
searchHistoryEl.addEventListener('click', function (event) {
    event.preventDefault();
    console.log(event.target.dataset.id);
    fetchCurrentCondition(event.target.dataset.id);

});

//display current weather
// humidity, temperature, name, date, icon, wind speed, uv index
function displayCurrentWeather(currentWeather, city) {
    console.log(currentWeather);
    let theCity = city;
    currentCityDetailEL.textContent = '';
    currentCity.textContent = theCity + ' ' + '(' + today + ')';


    //name
    var cityTitle = document.createElement('h2');
    cityTitle.textContent = theCity + ' ' + '(' + today + ')';
    currentCityDetailEL.appendChild(cityTitle)


    //wind speed
    var windSpeedEl = document.createElement('p');
    windSpeedEl.textContent = "Wind Speed: " + currentWeather.wind_speed + " MPH";
    currentCityDetailEL.appendChild(windSpeedEl);

    //humidity 
    var humidityEL = document.createElement('p');
    humidityEL.textContent = "Humidity: " + currentWeather.humidity + " %";
    currentCityDetailEL.appendChild(humidityEL);

    //temp as to have tempHolder because it has a few things listed in it 
    var temp = document.createElement('p');
    temp.textContent = "Temperature: " + currentWeather.temp + " °F";
    currentCityDetailEL.appendChild(temp);

    //uvi index 
    var uvIndexEL = document.createElement('p');
    uvIndexEL.textContent = "UV index: " + currentWeather.uvi;
    uvIndexEL.classList.add('uv-condition');
    currentCityDetailEL.appendChild(uvIndexEL);
    if (currentWeather.uvi < 3) {
        uvIndexEL.setAttribute('style', 'background-color: green; color: white;');
    } else if (currentWeather.uvi > 2 && currentWeather.uvi < 6) {
        uvIndexEL.setAttribute('style', 'background-color: yellow; color: black');
    } else {
        uvIndexEL.setAttribute('style', 'background-color: red');
    }


    //weather obj
    var weatherHolder = currentWeather.weather;
    console.log(weatherHolder[0].description);

    //icon
    console.log(`https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`);
    var iconUrl = `https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`;
    var weatherIconEl = document.createElement("img");
    weatherIconEl.setAttribute("src", iconUrl);
    weatherIconEl.setAttribute("alt", weatherHolder[0].description);
    weatherIconEl.classList.add('current_weather_icon');
    currentCityDetailEL.appendChild(weatherIconEl);


};

//display 5day forecast  history of cities
//an icon representation of weather conditions, the temperature, the wind speed, and the humidity 
function displayForecast(dailyWeather) {
    console.log(dailyWeather)
    console.log(dailyWeather[0].weather);
    fiveDayCardEl.innerHTML = '';

    for (j = 0; j < dailyWeather.length; j++) {
        //future date
        var fiveDaysForwardEL = new moment().add(j + 1, 'day').format('L');
        let newDateEL = document.createElement('p');
        newDateEL.textContent = fiveDaysForwardEL;



        //wind speed
        var windSpeedEl = document.createElement('p');
        windSpeedEl.textContent = "Wind Speed: " + dailyWeather[j].wind_speed + " MPH";

        //humidity 
        var humidityEL = document.createElement('p');
        humidityEL.textContent = "Humidity: " + dailyWeather[j].humidity + " %";

        //temp as to have tempHolder because it has a few things listed in it 
        var temp = document.createElement('p');
        var tempHolder = dailyWeather[j].temp;
        temp.textContent = "Temperature: " + tempHolder.day + " °F";

        //weather obj
        var weatherHolder = dailyWeather[j].weather;
        console.log(weatherHolder[0].description);

        //icon
        console.log(`https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`);
        var iconUrl = `https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`;
        var weatherIconEl = document.createElement("img");
        weatherIconEl.setAttribute("src", iconUrl);
        weatherIconEl.setAttribute("alt", weatherHolder[0].description);
        weatherIconEl.classList.add('weather_icon');


        //create a div
        var newCard = createWeatherDay(newDateEL, windSpeedEl, weatherIconEl, humidityEL, temp);
        fiveDayCardEl.appendChild(newCard);

    }


};

function createWeatherDay(dateEl, windSpeedEl, weatherIconEl, humidityEL, tempEl) {
    var cardDay = document.createElement('div');
    cardDay.setAttribute('class', 'card_body');


    // append to this day's info to new div 
    cardDay.append(dateEl, windSpeedEl, weatherIconEl, humidityEL, tempEl);

    //append this card to where it needs to go
    return cardDay;
};



//current city fetch
function fetchCurrentCondition(city) {
    console.log(city);
    var currentWeatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
    fetch(currentWeatherQueryURL)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            return data.coord;
        })
        .then(function (coord) {
            console.log(coord)
            var oneCallQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&units=imperial&appid=${APIKey}`;
            return fetch(oneCallQueryURL);
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (weather) {
            console.log(weather);
            displayCurrentWeather(weather.current, city);
            displayForecast(weather.daily.slice(1, 6));
        })
        .catch(function (err) {
            console.error(err);
        });



};

//save to local storage function
saveCityButton.addEventListener("click", function () {
    //get value from input box
    var cityInput = cityInputEL.value.trim();
    if (cityInput === "") {
        return;
    }
    saveCity(cityInput);
    displaySearchHistory();
    fetchCurrentCondition(cityInput);
});

displaySearchHistory();