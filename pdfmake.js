
// Define font files
var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

var pageBuilding = {
    name: 'STAL 5',
    cellHeigt: 10,
    VentPerAfd: 10,
    LStartVent: 1,
    LStartAfd: 50,
    LAantalAfd: 3,
    RStartVent: 25,
    RStartAfd: 53,
    RAantalAfd: 3
};

async function createPDF() {
    var docDefenition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [10, 10, 10, 10],
        content: []
    };
    var option = {

    };

    var table = {
        table: {
            headerRows: 1,
            widths: [ 20, 15, '*', '*', '*', '*', '*', '*', '*', 20, 15, '*', '*', '*', '*', '*', '*', '*' ],

            body: [
                [ {text: pageBuilding.name, colSpan: 2, alignment: 'center'}, {}, 'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo', {text: '', colSpan: 2, alignment: 'center'}, {}, 'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']
            ]
        }
    }

    table.table.body.push(['50', '1', '112', '', '', '', '', '', '', '53', '25', '116', '', '', '', '', '', '']);

    docDefenition.content.push(table);

    console.log(docDefenition);

    var pdfDoc = printer.createPdfKitDocument(docDefenition, option);
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();
}

module.exports = { createPDF };
