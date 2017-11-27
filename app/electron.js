const {app, BrowserWindow} = require('electron');
// const BrowserWindow = require('browser-window');

// browser-window creates a native window
var mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({ width: 1200, height: 900, 'web-preferences': {'web-security': false} });

  // Tell Electron where to load the entry point from
  mainWindow.loadURL('file://' + __dirname + '/../index.html');

  // Clear out the main window when the app is closed
  mainWindow.on('closed', function () {

    mainWindow = null;

  });

});
