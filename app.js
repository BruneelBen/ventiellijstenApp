/* **************************************************************** 
    App for automatic rewrite ventiellijsten
    more info about exceljs: https://www.npmjs.com/package/exceljs
    more info about xlsx: https://www.npmjs.com/package/xlsx    past pagina stijl aan
   **************************************************************** */

// requiring module
const { app, BrowserWindow, ipcMain } = require('electron');

// function for opening window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.removeMenu();
    win.loadFile('index.html');
    //win.webContents.openDevTools();
}

// if app ready open control window
app.whenReady().then(() => {
    createWindow();
});

// if any butten is pressed for closing close application
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on("test", function (evnt, arg) {
    console.log("test was good send this: " + arg);
});

let data = [];
let data2 = [];

console.log("App starting");
console.log("Main Done");

