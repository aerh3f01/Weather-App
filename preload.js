// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const moment = require('moment-timezone');

// Expose moment.js functionalities to the renderer process via the contextBridge
contextBridge.exposeInMainWorld('moment', {
  unix: (timestamp) => moment.unix(timestamp),
  tz: (timezone) => moment.tz(timezone),
  utcOffset: (timestamp, offset) => moment.unix(timestamp).utcOffset(offset),
  format: (timestamp, offset, formatString) => moment.unix(timestamp).utcOffset(offset).format(formatString)
});

// Expose custom Electron functionalities to the renderer process
contextBridge.exposeInMainWorld('electron', {
  getApiKey: () => new Promise((resolve) => {
    ipcRenderer.once('set-api-key', (_, apiKey) => {
      resolve(apiKey);
    });
  })
});