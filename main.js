// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
require('dotenv').config(); // Load environment variables

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // Use preload script
    }
  });

  win.loadFile('index.html');

  // Pass the API key to the renderer process
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-api-key', process.env.API_KEY);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
