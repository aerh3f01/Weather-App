// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getApiKey: () => new Promise((resolve) => {
    ipcRenderer.once('set-api-key', (_, apiKey) => {
      resolve(apiKey);
    });
  })
});
