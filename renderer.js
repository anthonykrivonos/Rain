// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const geolocation = require('./utility/geolocation.js');
const weather = require('./utility/weather.js');

let showLoad = (show) => {
      let loading = document.getElementsByClassName("loading")[0];
      let button = document.getElementsByClassName("btn")[0];
      if (loading && button && show) {
            loading.style.display = "inline-block";
            button.style.display = "none";
      } else if (loading && button) {
            loading.style.display = "none";
            button.style.display = "block";
      }
}

let updateSrc = (element, src) => {
      var els = document.getElementsByClassName(element);
      if (els) {for (var i = 0; i < els.length; i++) els[i]["src"] = src;}
}

let updateTemplate = (element, text) => {
      var els = document.getElementsByClassName(element);
      if (text && text != "") {
            if (els) {for (var i = 0; i < els.length; i++) els[i]["innerHTML"] = text;}
      } else {
            if (els) {for (var i = 0; i < els.length; i++) els[i]["style"]["display"] = "none";}
      }
}

let updateWeatherData = (weather) => {
      updateTemplate('location', weather.location);
      updateTemplate('lat', weather.lat);
      updateTemplate('long', weather.long);
      updateTemplate('timezone', weather.timezone);
      updateTemplate('type', weather.type);
      updateTemplate('minTemp', weather.minTemp);
      updateTemplate('maxTemp', weather.maxTemp);
      updateTemplate('curTemp', weather.curTemp);
      updateTemplate('windSpd', weather.windSpd);
      updateTemplate('humidity', weather.humidity);
      updateTemplate('visibility', weather.visibility);
      updateTemplate('predictability', weather.predictability);
      updateSrc('icon', weather.icon);
};

let toFahrenheit = (celsius) => {
      return celsius * 9 / 5 + 32;
}

let getWeather = () => {
      showLoad(true);
      geolocation.getLatLong((ll) => {
            weather.getWeatherFromLatLong(ll[0], ll[1], (wea) => {
                  var weatherData = weather.api(
                        `${wea.title} ${wea.location_type}`,
                        Math.round(ll[0]),
                        Math.round(ll[1]),
                        wea.timezone,
                        (wea.weather_state_name || "").toLowerCase(),
                        Math.round(toFahrenheit(wea.consolidated_weather[0].min_temp)),
                        Math.round(toFahrenheit(wea.consolidated_weather[0].max_temp)),
                        Math.round(toFahrenheit(wea.consolidated_weather[0].the_temp)),
                        Math.round(wea.consolidated_weather[0].wind_speed),
                        wea.consolidated_weather[0].humidity,
                        Math.round(wea.consolidated_weather[0].visibility),
                        Math.round(wea.consolidated_weather[0].predictability),
                        weather.getIcon(wea.consolidated_weather[0].weather_state_abbr)
                  );
                  updateWeatherData(weatherData);
                  showLoad(false);
            }, () => {
                  console.log(`Could not load weather.`);
                  showLoad(false);
            });
      }, () => {
            console.log(`Could not get latitude nor longitude.`);
            showLoad(false);
      });
};

module.exports = {
      getWeather
};
