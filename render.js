
const { remote } = require('electron');
var reader = require('xlsx');
const ExcelJS = require('exceljs');
const { dialog, Menu } = remote;

let data = [];

// text input
const inputFilePathBron = document.getElementById('inputFilePathBron');
const inputFilePathDoel = document.getElementById('inputFilePathDoel');
var filePathBron, filePathDoel;

// Buttons
const selectBronBtn = document.getElementById('selectBronBtn');
selectBronBtn.onclick = e => {
    selectBron();
}

const selectDoelBtn = document.getElementById('selectDoelBtn');
selectDoelBtn.onclick = e => {
    selectDoel();
}

const convertBtn = document.getElementById('convertBtn');
convertBtn.onclick = e => {
    convert();
}

async function selectBron() {
    const file = await dialog.showOpenDialog({
        buttonLabel: 'select bron'
    });
    // alert("Done");
    inputFilePathBron.innerHTML = file.filePaths;
    filePathBron = file.filePaths;
}

async function selectDoel() {
    const file = await dialog.showOpenDialog({
        buttonLabel: 'select Doel'
    });
    // alert("Done");
    inputFilePathDoel.innerHTML = file.filePaths;
    filePathDoel = file.filePaths;
}

async function convert() {
    await readFileToJson(filePathBron.toString());
    await writeVentielen(filePathDoel.toString());
    alert("Done");
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

/* **************************************************************** */
/* Write ventiles to correct places                                 */
/* **************************************************************** */
async function writeVentielen(path) {
    
    const workbook = new ExcelJS.Workbook();    // start workbook for working in
    await workbook.xlsx.readFile(path);         // read file with alle data


    // checking of sheets correct
    if (workbook.worksheets[0].name != "Ventiellijst stal 4") {
        console.error("Error: Sheet 1 is not named 'Ventiellijst stal 4'");
        process.exit(1);
    }
    if (workbook.worksheets[1].name != "Ventiellijst stal 2+3") {
        console.error("Error: Sheet 2 is not named 'Ventiellijst stal 2+3'");
        process.exit(1);
    }
    if (workbook.worksheets[2].name != "Ventiellijst stal 5") {
        console.error("Error: Sheet 3 is not named 'Ventiellijst stal 5'");
        process.exit(1);
    }

    var cellWrite = workbook.worksheets[1].getCell('C1');    // define cell write
    for (var i = 2; i <= 24; i++) {                                    // stal 2 all cels making empty
        cellWrite = workbook.worksheets[1].getCell('C' + i);
        cellWrite.value = null;
        cellWrite = workbook.worksheets[1].getCell('L' + i);
        cellWrite.value = null;
    }
    for (var i = 29; i <= 58; i++) {                                    // stal 3 all cels making empty
        cellWrite = workbook.worksheets[1].getCell('C' + i);
        cellWrite.value = null;
        cellWrite = workbook.worksheets[1].getCell('L' + i);
        cellWrite.value = null;
    }
    for (var i = 2; i <= 51; i++) {                                    // stal 4 deel 1 all cels making empty
        cellWrite = workbook.worksheets[0].getCell('C' + i);
        cellWrite.value = null;
        cellWrite = workbook.worksheets[0].getCell('L' + i);
        cellWrite.value = null;
    }
    for (var i = 53; i <= 102; i++) {                                    // stal 4 deel 2 all cels making empty
        cellWrite = workbook.worksheets[0].getCell('C' + i);
        cellWrite.value = null;
        cellWrite = workbook.worksheets[0].getCell('L' + i);
        cellWrite.value = null;
    }
    for (var i = 2; i <= 25; i++) {                                    // stal 5 deel 1 all cels making empty
        cellWrite = workbook.worksheets[2].getCell('C' + i);
        cellWrite.value = null;
        cellWrite = workbook.worksheets[2].getCell('L' + i);
        cellWrite.value = null;
    }
    for (var i = 29; i <= 52; i++) {                                    // stal 5 deel 2 all cels making empty
        cellWrite = workbook.worksheets[2].getCell('C' + i);
        cellWrite.value = null;
        cellWrite = workbook.worksheets[2].getCell('L' + i);
        cellWrite.value = null;
    }

    data.forEach((res) => {          // for each readed data do one write cycle to the excel
        var splited = res.Locatie.split(' ');       // split the location variable in parts for the stal and ventiel number splited
        
        // check witche stal it is
        if (splited[2] == 2) {
            writeStal2(workbook, splited[12], res['Basisaanp. [%]']);
        } else if (splited[2] == 3) {
            writeStal3(workbook, splited[12], res['Basisaanp. [%]']);
        } else if (splited[2] == 4) {
            writeStal4(workbook, splited[12], res['Basisaanp. [%]']);
        } else if (splited[2] == 5) {
            writeStal5(workbook, splited[12], res['Basisaanp. [%]']);
        } else {
            console.log("Error: stal not found");
        }
    });

    await workbook.xlsx.writeFile(path);        // write it back to correct output file

    console.log("Write Done");
}

/* **************************************************************** */
/* Write ventielen in stal 2                                        */
/* **************************************************************** */
function writeStal2(workbook, ventiel, basisProcent) {
    for (var i = 2; i <= 24; i++) {                                    // alle te overlopen cellen overlopen linkse kollom
        const cellRead = workbook.worksheets[1].getCell('B' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[1].getCell('C' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 2; i <= 24; i++) {                                    // alle te overlopen cellen overlopen rechtse kollom
        const cellRead = workbook.worksheets[1].getCell('K' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[1].getCell('L' + i);
            cellWrite.value = basisProcent;
        }
    }
}

/* **************************************************************** */
/* Write ventielen in stal 3                                        */
/* **************************************************************** */
function writeStal3(workbook, ventiel, basisProcent) {
    for (var i = 29; i <= 58; i++) {                                    // alle te overlopen cellen overlopen linkse kollom
        const cellRead = workbook.worksheets[1].getCell('B' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[1].getCell('C' + i);
            cellWrite.value = basisProcent;
            return;
        }
    }
    for (var i = 29; i <= 58; i++) {                                    // alle te overlopen cellen overlopen rechtse kollom
        const cellRead = workbook.worksheets[1].getCell('K' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[1].getCell('L' + i);
            cellWrite.value = basisProcent;
            return;
        }
    }
}

/* **************************************************************** */
/* Write ventielen in stal 4                                        */
/* **************************************************************** */
function writeStal4(workbook, ventiel, basisProcent) {
    for (var i = 2; i <= 51; i++) {                                    // alle te overlopen cellen overlopen linkse kollom deel 1
        const cellRead = workbook.worksheets[0].getCell('B' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[0].getCell('C' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 2; i <= 51; i++) {                                    // alle te overlopen cellen overlopen rechtse kollom deel 1
        const cellRead = workbook.worksheets[0].getCell('K' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[0].getCell('L' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 53; i <= 102; i++) {                                    // alle te overlopen cellen overlopen linkse kollom deel 2
        const cellRead = workbook.worksheets[0].getCell('B' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[0].getCell('C' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 53; i <= 92; i++) {                                    // alle te overlopen cellen overlopen rechtse kollom deel 2
        const cellRead = workbook.worksheets[0].getCell('K' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[0].getCell('L' + i);
            cellWrite.value = basisProcent;
        }
    }
}

/* **************************************************************** */
/* Write ventielen in stal 5                                        */
/* **************************************************************** */
function writeStal5(workbook, ventiel, basisProcent) {
    for (var i = 2; i <= 25; i++) {                                    // alle te overlopen cellen overlopen linkse kollom deel
        const cellRead = workbook.worksheets[2].getCell('B' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[2].getCell('C' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 2; i <= 25; i++) {                                    // alle te overlopen cellen overlopen rechtse kollom deel 1
        const cellRead = workbook.worksheets[2].getCell('K' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[2].getCell('L' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 29; i <= 52; i++) {                                    // alle te overlopen cellen overlopen linkse kollom deel
        const cellRead = workbook.worksheets[2].getCell('B' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[2].getCell('C' + i);
            cellWrite.value = basisProcent;
        }
    }
    for (var i = 29; i <= 52; i++) {                                    // alle te overlopen cellen overlopen rechtse kollom deel 1
        const cellRead = workbook.worksheets[2].getCell('K' + i);       // ventiel nummer ophalen
        if (cellRead.value == ventiel) {                                // als ventiel nummer juist het vakje er naast dit laten wegschrijven
            const cellWrite = workbook.worksheets[2].getCell('L' + i);
            cellWrite.value = basisProcent;
        }
    }
}