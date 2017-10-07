const USERNAME = "anthonykrivonos.fordham";
const API_KEY = "W9I7cNmyTrjbr0zYiZ46";

var plotly = require('plotly')(USERNAME, API_KEY);

const CHARTS = {
      BAR: "bar",
      SCATTER3D: "scatter3d"
};

let bar = (x, y) => {
      console.log(`x-axis: ${JSON.stringify(x)}\ny-axis: ${JSON.stringify(y)}`);
      var data = [
            {
                  x,
                  y,
                  type: CHARTS.BAR
            }
      ];
      var graphOptions = {filename: "weather-bar", fileopt: "overwrite"};
      plotly.plot(data, graphOptions, (err, msg) => {
            console.error(err || msg || "An error occurred while plotting.");
      });
};

let scatter3d = (x, y, z) => {
      console.log(`x-axis: ${JSON.stringify(x)}\ny-axis: ${JSON.stringify(y)}\nz-axis: ${JSON.stringify(z)}`);
      var data = [{
            x, y, z,
            mode: "markers",
            marker: {
                  size: 12,
                  line: {
                        color: "rgba(217, 217, 217, 0.14)",
                        width: 0.5
                  },
                  opacity: 0.8
            },
            type: CHARTS.SCATTER3D
      }];
      var layout = {margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
      }};
      var graphOptions = {layout: layout, filename: "weather-3d-scatter", fileopt: "overwrite"};
      plotly.plot(data, graphOptions, function (err, msg) {
            console.error(err || msg || "An error occurred while plotting.");
      });
};

module.exports = {
      bar, scatter3d
}
