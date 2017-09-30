const request = require('request');

const ENDPOINTS = {
      URL: 'https://www.metaweather.com',
      ICON: '/static/img/weather/png/',
      WOEID: '/api/location/search/?lattlong=',
      WEATHER: '/api/location/'
};

let getIcon = (icon) => {
      return ENDPOINTS.URL + ENDPOINTS.ICON + icon + ".png";
};

let getWOEIDFromLatLong = (lat, long, success, failure) => {
      request(ENDPOINTS.URL + ENDPOINTS.WOEID + lat + ',' + long,
      (error, res, body) => {
            var loc = JSON.parse(body);
            if (success && loc && loc[0] && loc[0].woeid) {
                  success(loc[0].woeid);
            } else if (failure && !loc) failure();
      });
};

let getWeather = (woeid, success, failure) => {
      request(ENDPOINTS.URL + ENDPOINTS.WEATHER + woeid,
      (error, res, body) => {
            var wea = JSON.parse(body);
            if (success && wea) success(wea);
            else if (failure && !res) failure();
      });
};

let getWeatherFromLatLong = (lat, long, success, failure) => {
      getWOEIDFromLatLong(lat, long, (woeid) => {
            getWeather(woeid, (res) => {
                  if (success) success(res);
            }, () => {
                  if (failure) failure();
            });
      }, () => {
            if (failure) failure();
      });
};

let api = (location, lat, long, timezone, type, minTemp, maxTemp, curTemp, windSpd, humidity, visibility, predictability, icon) => {
      return {
            location,
            lat,
            long,
            timezone,
            type,
            minTemp,
            maxTemp,
            curTemp,
            windSpd,
            humidity,
            visibility,
            predictability,
            icon
      };
}

module.exports = {
      getIcon,
      getWOEIDFromLatLong,
      getWeather,
      getWeatherFromLatLong,
      api
};
