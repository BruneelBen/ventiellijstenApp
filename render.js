
//const { remote } = require('electron');
const ipcRenderer = require('electron').ipcRenderer;

let data = [];

// text input
const inputFilePathBron = document.getElementById('inputFilePathBron');
const inputFilePathDoel = document.getElementById('inputFilePathDoel');
var filePathBron, filePathDoel;

// Buttons
const selectBronBtn = document.getElementById('selectBronBtn');
selectBronBtn.onclick = e => {
    //selectBron();
    ipcRenderer.send("test", "Hello world !!!");
}

const selectDoelBtn = document.getElementById('selectDoelBtn');
selectDoelBtn.onclick = e => {
    //selectDoel();
}

const convertBtn = document.getElementById('convertBtn');
convertBtn.onclick = e => {
    //convert();
}
