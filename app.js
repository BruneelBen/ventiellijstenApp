/* **************************************************************** 
    App for automatic rewrite ventiellijsten
    more info about exceljs: https://www.npmjs.com/package/exceljs
    more info about xlsx: https://www.npmjs.com/package/xlsx    past pagina stijl aan
   **************************************************************** */

// requiring module
var reader = require('xlsx');
const pdfmake = require('./pdfmake');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

let win;

// function for opening window
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.removeMenu();
    win.loadFile('index.html');
    win.webContents.openDevTools();
    //win.showInactive();
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
    win.hide();
    console.log(dialog.showOpenDialogSync({ properties: ['openDirectory'] }));
    win.show();
    //askFile();
});

let data = [];
let data2 = [];

console.log("App starting");
main();
console.log("Main Done");

async function askFile() {
    var file;
    file = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
    console.log(file);
}

/* **************************************************************** */
/* async main function                                              */
/* **************************************************************** */
async function main() {
    await readFileToJson("C:/Users/Ben Bruneel/Documents/1 Documenten Ben Bruneel/ventiellijstenApp/20211017_Dierbestandsboek.xlsx");
    //writeVentielen("./ventiellijst 2345.xlsx");
    pdfmake.createPDF(data);
    console.log("async Main Done");
}

/* **************************************************************** */
/* read file to Json                                                */
/* **************************************************************** */
async function readFileToJson(path) {
    // Reading the file from the computer
    var file = reader.readFile(path);

    // take alle data from sheet to json
    var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    temp.forEach((res) => {
        data.push(res);
    });
}
