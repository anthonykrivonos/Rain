const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

require('electron-reload')(__dirname, {
      electron: require('${__dirname}/../../node_modules/electron')
});

let mainWindow;

function createWindow () {
      mainWindow = new BrowserWindow({
            width: 400,
            height: 400,
            center: true,
            resizable: false,
            fullscreen: false,
            vibrancy: "popover"
      })

      mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
      }))

      mainWindow.on('closed', function () {
            mainWindow = null
      })

      //mainWindow.openDevTools();
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
            app.quit()
      }
})

app.on('activate', function () {
      if (mainWindow === null) {
            createWindow()
      }
})
