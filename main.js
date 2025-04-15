const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer")
const electron = require('electron');
const path = require('node:path');
const isDev = process.env.NODE_ENV === 'development';
const { app, BrowserWindow, shell } = electron
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Money Tracker",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
    icon: path.join(__dirname, 'logo.png')
  });
  win.setIcon(path.join(__dirname, 'logo.png'))
  if (isDev) win.loadURL('http://localhost:3000');
  else win.loadFile(path.join(__dirname, 'build', 'index.html'), { hash: '' });
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url); // Opens URL in the default browser.
    return { action: 'deny' }; // Prevents the URL from opening in the Electron app.
  });
}
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((ext) => console.log(`Added Extension: ${ext.name}`))
      .catch((err) => console.log('An error occurred: ', err));
    installExtension(REDUX_DEVTOOLS)
      .then((ext) => console.log(`Added Extension: ${ext.name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
  createWindow();
});
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
app.on('window-all-closed', () => { app.quit(); });
