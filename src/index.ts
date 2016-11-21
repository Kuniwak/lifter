import * as electron from "electron";
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const windowStateKeeper = require('electron-window-state');

let mainWindow: any = null;

let createWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    mainWindow = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindowState.manage(mainWindow);
};
app.on('ready', createWindow);
if (process.platform !== 'darwin') {
    app.on('window-all-closed', () => app.quit());
}
app.on('activate', () => mainWindow || createWindow());
