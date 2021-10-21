
const { dialog } = require('electron');
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
    //console.log(dialog.showOpenDialog({ properties: ['openFile'] }))
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

const fileBtn = document.getElementById('i_file');
fileBtn.onchange = e => {
    //convert();
    console.log(e.target.files[0]);
    var tmppath = URL.createObjectURL(e.target.files[0]);
}
