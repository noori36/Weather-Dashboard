var APIKey = "4d1979260c9e999ebed23e508c592fd3";

var cityInputEl = $('#city-input');
var searchBtn = $('#search-button');
var searchHistoryEl = $('#search-history');
var city;

function getWeather(data) {
    // Open Weather API call
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIkey}`
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            // weather element
            var currentWeatherEl = $('#currentWeather');
            currentWeatherEl.addClass('border border-primary');

            // city name element
            var cityNameEl = $('<h2>');
            cityNameEl.text(city);
            currentWeatherEl.append(cityNameEl);
            
            // date element
            var cityDate = data.current.dt;
            cityDate = moment.unix(cityDate).format("MM/DD/YYYY");
            var currentDateEl = $('<span>');
            currentDateEl.text(` (${cityDate}) `);
            cityNameEl.append(currentDateEl);

            // weather icon         
            var cityWeatherIcon = data.current.weather[0].icon;
            var currentWeatherIconEl = $('<img>');
            currentWeatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + cityWeatherIcon + ".png");
            cityNameEl.append(currentWeatherIconEl);

            // temp
            var cityTemp = data.current.temp;
            var currentTempEl = $('<p>')
            currentTempEl.text(`Temp: ${cityTemp}°C`)
            currentWeatherEl.append(currentTempEl);
            
            // wind
            var cityWind = data.current.wind_speed;
            var currentWindEl = $('<p>')
            currentWindEl.text(`Wind: ${cityWind} KPH`)
            currentWeatherEl.append(currentWindEl);

            // humidity
            var cityHumidity = data.current.humidity;
            var currentHumidityEl = $('<p>')
            currentHumidityEl.text(`Humidity: ${cityHumidity}%`)
            currentWeatherEl.append(currentHumidityEl);

            // UV index
            var cityUV = data.current.uvi;
            var currentUvEl = $('<p>');
            var currentUvSpanEl = $('<span>');
            currentUvEl.append(currentUvSpanEl);
            currentUvSpanEl.text(`UV Index: ${cityUV}`)
            
            // background colors for UV index
            if ( cityUV < 3 ) {
                currentUvSpanEl.css({'background-color':'green', 'color':'white'});
            } else if ( cityUV > 2 && cityUV < 6 ) {
                currentUvSpanEl.css({'background-color':'yellow', 'color':'black'});
            } else {
                currentUvSpanEl.css({'background-color':'red', 'color':'white'});
            } 

            currentWeatherEl.append(currentUvEl);

            // five day forecast
            var fiveDayForecastHeaderEl = $('#fiveDayForecastHeader');
            var fiveDayHeaderEl = $('<h2>');
            fiveDayHeaderEl.text('5-Day Forecast:');
            fiveDayForecastHeaderEl.append(fiveDayHeaderEl);

            var fiveDayForecastEl = $('#fiveDayForecast');

            // API data for five day forecast and display
            for (var i = 1; i <=5; i++) {
                var date;
                var temp;
                var icon;
                var wind;
                var humidity;

                date = data.daily[i].dt;
                date = moment.unix(date).format("MM/DD/YYYY");

                temp = data.daily[i].temp.day;
                icon = data.daily[i].weather[0].icon;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;

                // 5-Day Forecast card
                var card = document.createElement('div');
                card.classList.add('card', 'col-2', 'm-1', 'bg-primary', 'text-white');
                
                var cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                cardBody.innerHTML = `<h6>${date}</h6>
                                      <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                       ${temp}°C<br>
                                       ${wind} KPH <br>
                                       ${humidity}%`
                
                card.appendChild(cardBody);
                fiveDayForecastEl.append(card);
            }
        })
    return;
}

function displaySearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var pastSearchesEl = document.getElementById('search-history');

    pastSearchesEl.innerHTML ='';

    for (i = 0; i < storedCities.length; i++) 
    {
        var pastCityBtn = document.createElement("button");
        pastCityBtn.classList.add("btn", "btn-primary", "my-2", "past-city");
        pastCityBtn.setAttribute("style", "width: 100%");
        pastCityBtn.textContent = `${storedCities[i].city}`;
        pastSearchesEl.appendChild(pastCityBtn);
    }
    return;
}

function getCoordinates () {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];

    fetch(requestUrl)
      .then(function (response) {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
      })
      .then(function(data) {
 
        var cityInfo = {
            city: city,
            lon: data.coord.lon,
            lat: data.coord.lat
        }

        storedCities.push(cityInfo);
        localStorage.setItem("cities", JSON.stringify(storedCities));

        displaySearchHistory();

        return cityInfo;
      })
      .then(function (data) {
        getWeather(data);
      })
      return;
}

function clearCityWeather () {
    var currentWeatherEl = document.getElementById("currentWeather");
    currentWeatherEl.innerHTML = '';

    var fiveDayForecastHeaderEl = document.getElementById("fiveDayForecastHeader");
    fiveDayForecastHeaderEl.innerHTML = '';

    var fiveDayForecastEl = document.getElementById("fiveDayForecast");
    fiveDayForecastEl.innerHTML = '';

    return;
}

function submitCityFormBtn (event) {
    event.preventDefault();
    city = cityInputEl.val().trim();

    clearCityWeather();
    getCoordinates();

    return;
}

//user should be able to click on past search cities to check the updated weather - search history
function getPastCity (event) {
    var element = event.target;

    if (element.matches(".past-city")) {
        city = element.textContent;    
        clearCityWeather();

        var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;
        fetch(requestUrl)
          .then(function (response) {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } 
              else {
                throw Error(response.statusText);
              }
           })
           .then(function(data) {
                var cityInfo = {
                    city: city,
                    lon: data.coord.lon,
                    lat: data.coord.lat
                }
                return cityInfo;
            })
           .then(function (data) {
                getWeather(data);
        })
    }
    return;
}

displaySearchHistory();

searchBtn.on("click", submitCityFormBtn);
searchHistoryEl.on("click", getPastCity);