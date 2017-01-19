import {app, BrowserWindow} from "electron";
import "./menu";

const windowStateKeeper = require('electron-window-state');

let mainWindow: any = null;

let createWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
    });

    mainWindow = new BrowserWindow(mainWindowState);
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
