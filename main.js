const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer")
const electron = require('electron');
// const { default: Store } = require("electron-store");
const path = require('node:path');
const { EVENTS_NAME } = require('./src/utils')
const fs = require('node:fs');
const isDev = process.env.NODE_ENV === 'development';
const { app, BrowserWindow, shell, ipcMain } = electron
const savedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));
let lsEvent = {"events":[]};
let isSavingData = JSON.stringify(savedData.events) === JSON.stringify(lsEvent.events)
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Money Tracker",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDev,
    },
    icon: `${__dirname}/logo.png`
  });
  win.setIcon(`${__dirname}/logo.png`)
  if (isDev) win.loadURL('http://localhost:3000');
  else win.loadFile(path.join(__dirname, 'build', 'index.html'), { hash: '' });
  app.on('before-quit', (event) => {
    if (isSavingData) {
      event.preventDefault();
      win.webContents.send('app-before-quit')
    }
  });
  ipcMain.on('initializing', async (_, data) => {
    try {
      const result = await win.webContents.executeJavaScript(`localStorage.getItem("${EVENTS_NAME}");`, true)
      lsEvent.events = result;
      if (JSON.stringify(savedData.events) !== JSON.stringify(lsEvent.events)) isSavingData = true;
      else isSavingData = false;
    } catch (error) {
      console.log("ERROR", error);
    }
  });
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url); // Opens URL in the default browser.
    return { action: 'deny' }; // Prevents the URL from opening in the Electron app.
  });
}
app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((ext) => console.log(`Added Extension: ${ext.name}`))
    .catch((err) => console.log('An error occurred: ', err));
  installExtension(REDUX_DEVTOOLS)
    .then((ext) => console.log(`Added Extension: ${ext.name}`))
    .catch((err) => console.log('An error occurred: ', err));
  createWindow();
});
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (isSavingData) {
      fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(lsEvent));
      isSavingData = false;
      app.quit();
    }
    else app.quit();
  }
});
