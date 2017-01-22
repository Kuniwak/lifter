import {app, BrowserWindow} from "electron";
import "./create-menu";
import {createMenu} from "./create-menu";

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
    createMenu();
};
app.on('ready', createWindow);

if (process.platform !== 'darwin') {
    app.on('window-all-closed', () => app.quit());
}
app.on('activate', () => mainWindow || createWindow());
