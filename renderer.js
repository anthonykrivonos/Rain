// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const geolocation = require('./utility/geolocation.js');
const weather = require('./utility/weather.js');
const plotter = require('./utility/plotter.js');

const CHART_TYPE = "3d";

let curLat = 0, curLong = 0;

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

let showChart = (chart) => {
      let chart2d = document.getElementsByClassName("chart2d")[0];
      let chart3d = document.getElementsByClassName("chart3d")[0];
      if (chart == "2d" || chart == 2) {
            chart2d.style.display = "inline-block";
            chart3d.style.display = "none";
      } else if (chart == "3d" || chart == 3){
            chart2d.style.display = "none";
            chart3d.style.display = "inline-block";
      } else {
            chart2d.style.display = "none";
            chart3d.style.display = "none";
      }
}

let toggleWeather = () => {
      let weather = document.getElementsByClassName("weather-icon")[0];
      let chart2d = document.getElementsByClassName("chart2d")[0];
      let chart3d = document.getElementsByClassName("chart3d")[0];
      if (weather.style.display != "none") {
            weather.style.display = "none";
            console.log("Hiding weather.");
            if (CHART_TYPE == "3d") showChart("3d");
            else showChart("2d");
      } else {
            weather.style.display = "inline-block";
            console.log("Showing weather.");
            showChart("");
      }
}

let plotAdjacent = (dir = CHART_TYPE, data = "curTemp", lat = curLat, long = curLong, spread = 5, space = 1) => {
      if (!lat && !long) return;
      var lats = [], longs = [], vals = [], dirA,  dirB;
      var recursivePlot = (spread, lat, long) => {
            if (spread <= 0) return;
            lats.push(lat);
            longs.push(long);
            recursivePlot(--spread, lat-space, long-space);
            recursivePlot(--spread, lat+space, long+space);
      };
      recursivePlot(spread, lat, long);
      var asyncPopulateVals = (i) => {
            if (i < lats.length && i < longs.length) {
                  weather.getWeatherFromLatLong(dir == "3d" ? lats[i] : (dir == "lat" ? lats[i] : lat), dir == "3d" ? longs[i] : (dir == "lat" ? long : longs[i]), (wea) => {
                        vals[i] = parseWeatherData(dir == "3d" ? lats[i] : (dir == "lat" ? lats[i] : lat), dir == "3d" ? longs[i] : (dir == "lat" ? long : longs[i]), wea)[data];
                        console.log(`Added ${vals[i]} at idx ${i}`);
                        asyncPopulateVals(++i);
                  });
            } else if (i == lats.length && i == longs.length) {
                  if (dir == "lat") plotter.bar(lats, vals);
                  else if (dir == "long") {
                        showChart("2d");
                        plotter.bar(longs, vals);
                  }
                  else {
                        showChart("3d");
                        plotter.scatter3d(lats, longs, vals);
                  }
                  console.log("Plotted bar graph");

            } else {
                  console.error("Could not plot bar graph");
            }
      };
      asyncPopulateVals(0);
};

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
      updateTemplate('pressure', weather.pressure);
      updateTemplate('visibility', weather.visibility);
      updateTemplate('predictability', weather.predictability);
      updateSrc('icon', weather.icon);
};

let toFahrenheit = (celsius) => {
      return celsius * 9 / 5 + 32;
}

let parseWeatherData = (lat, long, wea) => {
      return weather.api(
            `${wea.title} ${wea.location_type}`,
            Math.round(lat),
            Math.round(long),
            wea.timezone,
            (wea.weather_state_name || "").toLowerCase(),
            Math.round(toFahrenheit(wea.consolidated_weather[0].min_temp)),
            Math.round(toFahrenheit(wea.consolidated_weather[0].max_temp)),
            Math.round(toFahrenheit(wea.consolidated_weather[0].the_temp)),
            Math.round(wea.consolidated_weather[0].wind_speed),
            wea.consolidated_weather[0].humidity,
            wea.consolidated_weather[0].air_pressure,
            Math.round(wea.consolidated_weather[0].visibility),
            Math.round(wea.consolidated_weather[0].predictability),
            weather.getIcon(wea.consolidated_weather[0].weather_state_abbr)
      );
}

let getWeather = (success = null, failure = null) => {
      showLoad(true);
      geolocation.getLatLong((ll) => {
            curLat = ll[0];
            curLong = ll[1];
            weather.getWeatherFromLatLong(ll[0], ll[1], (wea) => {
                  var weatherData = parseWeatherData(ll[0], ll[1], wea);
                  updateWeatherData(weatherData);
                  showLoad(false);
                  if (success) success(weatherData, ll[0], ll[1]);
            }, () => {
                  console.log(`Could not load weather.`);
                  if (failure) failure();
                  showLoad(false);
            });
      }, () => {
            console.log(`Could not get latitude nor longitude.`);
            showLoad(false);
      });
};

module.exports = {
      getWeather, toggleWeather, plotAdjacent
};
