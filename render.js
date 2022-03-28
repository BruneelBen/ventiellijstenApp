
const { dialog } = require('electron');
const ipcRenderer = require('electron').ipcRenderer;

let data = [];

// all managed buttons
const filePath = document.getElementById('filePath');
const selectFileBtn = document.getElementById('selectFileBtn');
const directoryPath = document.getElementById('directoryPath');
const selectPathBtn = document.getElementById('selectPathBtn');
const name = document.getElementById('name');
const fileDate = document.getElementById('fileDate');
const saveBtn = document.getElementById('saveBtn');

// select file excel file
selectFileBtn.onclick = e => {
    ipcRenderer.send("btn", "selectFileBtn");
}

// select path
selectPathBtn.onclick = e => {
    ipcRenderer.send("btn", "selectPathBtn");
}

// select path
saveBtn.onclick = e => {
    ipcRenderer.send("btn", "saveBtn");
}

// upload to influx
fileDateBtn.onclick = e => {
    ipcRenderer.send("btn", "fileDateBtn");
}

// past path to file
filePath.onchange = e => {
    ipcRenderer.send("filePath", filePath.value);
}

// past path
directoryPath.onchange = e => {
    ipcRenderer.send("directoryPath", directoryPath.value);
}

// name field
name.onchange = e => {
    ipcRenderer.send("name", name.value);
}

// name field
fileDate.onchange = e => {
    ipcRenderer.send("fileDate", fileDate.value);
}

// load path selected file
ipcRenderer.on("filePath", function (evnt, arg) {
    filePath.value = arg;
});

// load path selected path
ipcRenderer.on("directoryPath", function (evnt, arg) {
    directoryPath.value = arg;
});

// load name
ipcRenderer.on("name", function (evnt, arg) {
    name.value = arg;
});

ipcRenderer.on("fileDate", function (evnt, arg) {
    fileDate.value = arg;
});

// reply to user from backend
ipcRenderer.on("saveAction", function (evnt, arg) {
    alert("arg");
});
