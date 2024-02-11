/* **************************************************************** 
    App for automatic rewrite ventiellijsten
    more info about exceljs: https://www.npmjs.com/package/exceljs
    more info about xlsx: https://www.npmjs.com/package/xlsx    past pagina stijl aan
   **************************************************************** */

// requiring module
var reader = require('xlsx');
const pdfmake = require('./pdfmake');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('./config');

let win;
var filePath, directoryPath, name;

// page settings for pdf make this must be can generate by user
var pageBuilding;

// function for opening window
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: __dirname + '/translate.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.removeMenu();
    win.loadFile('index.html');
    //win.webContents.openDevTools();
    //win.showInactive();
}

// if app ready open control window
app.whenReady().then(() => {
    createWindow();
    const config = new Store();
    pageBuilding = config.getElement("Bruneel-cox");
});

// if any butten is pressed for closing close application
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on("btn", function (evnt, arg) {
    if (arg == "selectFileBtn") {
        win.hide();
        var newFilePath = dialog.showOpenDialogSync({ properties: ['openFile'], filters:
                    [
                        {
                            "name": "Exel",
                            "extensions": ["xlsx"]
                        },
                    ],});
        win.show();
        if (newFilePath != null) {
            filePath = newFilePath;
            evnt.reply("filePath", filePath);
            name = path.basename(filePath.toString(), '.xlsx').toString();
            evnt.reply("name", name);
        }
    } else if (arg == "selectPathBtn") {
        win.hide();
        var newDirectoryPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
        win.show();
        if (newDirectoryPath != null) {
            directoryPath = newDirectoryPath;
            evnt.reply("directoryPath", directoryPath);
        }
    } else if (arg == "saveBtn") {
        if (filePath != null && directoryPath != null && name != null) {
            convert(filePath, directoryPath + "/" + name + ".pdf", pageBuilding);
            dialog.showMessageBox({
                title: "Save file",
                icon: __dirname + '/translate.png',
                message: "If notting wrong the document is written."
            });
        } else {
            dialog.showMessageBox({
                title: "Save file",
                icon: __dirname + '/translate.png',
                message: "Not all field are filled in for reading or writing the file."
            });
        }
    }
});

ipcMain.on("filePath", function (evnt, arg) {
    filePath = arg;
});

ipcMain.on("directoryPath", function (evnt, arg) {
    directoryPath = arg;
});

ipcMain.on("name", function (evnt, arg) {
    name = arg;
});

let data = [];

console.log("App starting");
//main();
console.log("Main Done");

/* **************************************************************** */
/* async main function                                              */
/* **************************************************************** */
async function convert(convertFilepath, saveFilePath, pageBuilding) {
    await readFileToJson(convertFilepath.toString());
    pdfmake.createPDF(data, saveFilePath.toString(), pageBuilding);
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
