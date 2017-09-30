const location = require('iplocation');
const publicIp = require('public-ip');

let getLatLong = (success, failure) => {
      getIp((ip) => {
            getCurrentLocation(ip, (loc) => {
                  if (loc && loc.latitude && loc.longitude) {
                        success([loc.latitude, loc.longitude]);
                  } else if (failure) failure();
            }, () => {
                  if (failure) failure();
            });
      }, () => {
            if (failure) failure();
      })
};

let getIp = (success, failure) => {
      publicIp.v4().then(ip => {
            if (success) success(ip);
            else if (failure) failure();
      }).catch(() => {if (failure) failure()});
};

let getCurrentLocation = (ip, success, failure) => {
      location(ip, function (error, res) {
            if (success && res) success(res);
            else if (failure && (error || !res)) failure(res);
      });
};

module.exports = {
      getLatLong
};
