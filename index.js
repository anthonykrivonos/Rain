const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

const path = require('path');
const url = require('url');

require('electron-reload')(__dirname, {
      electron: require('${__dirname}/../../node_modules/electron')
});

let mainWindow, menu;

function createWindow () {
      mainWindow = new BrowserWindow({
            width: 700,
            height: 500,
            center: true,
            resizable: false,
            fullscreen: false
      })

      mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
      }))

      mainWindow.on('closed', function () {
            mainWindow = null
      })

      // mainWindow.openDevTools();

      const template = [
            {
                  label: 'Edit',
                  submenu: [
                        {role: 'undo'},
                        {role: 'redo'},
                        {type: 'separator'},
                        {role: 'cut'},
                        {role: 'copy'},
                        {role: 'paste'},
                        {role: 'pasteandmatchstyle'},
                        {role: 'delete'},
                        {role: 'selectall'}
                  ]
            },
            {
                  label: 'View',
                  submenu: [
                        {role: 'reload'},
                        {role: 'forcereload'},
                        {role: 'toggledevtools'}
                  ]
            },
            {
                  role: 'window',
                  submenu: [
                        {role: 'minimize'},
                        {role: 'close'}
                  ]
            }
      ]

      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
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
