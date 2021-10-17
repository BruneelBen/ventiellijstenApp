
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
const { data } = require('jquery');

var pageBuilding = {
    name: 'STAL 5',
    cellHeigt: 10,
    afUp: true,
    VentPerAfd: 8,
    LStartVent: 1,
    LStartAfd: 50,
    LAantalAfd: 3,
    RStartVent: 25,
    RStartAfd: 53,
    RAantalAfd: 3
};
var pageBuilding2 = {
    name: 'STAL 5',
    cellHeigt: 10,
    afUp: false,
    VentPerAfd: 8,
    LStartVent: 49,
    LStartAfd: 61,
    LAantalAfd: 3,
    RStartVent: 73,
    RStartAfd: 58,
    RAantalAfd: 3
};

async function createPDF(inputData) {
    var docDefenition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [10, 10, 10, 10],
        defaultStyle: {
            fontSize: 9
        },
        content: []
    };
    var option = {

    };

    // table.table.body.push(['50', '1', '112', '', '', '', '', '', '', '53', '25', '116', '', '', '', '', '', '']);

    // var LTellerVent = pageBuilding.LStartVent;
    // var RTellerVent = pageBuilding.RStartVent;
    // for (var LTellerAfd = pageBuilding.LStartAfd, RTellerAfd = pageBuilding.RStartAfd; ((pageBuilding.LStartAfd + pageBuilding.LAantalAfd) > LTellerAfd) || ((pageBuilding.RStartAfd + pageBuilding.RAantalAfd) > RTellerAfd); LTellerAfd++, RTellerAfd++) {
    //     table.table.body.push([LTellerAfd, LTellerVent, '112', '', '', '', '', '', '', RTellerAfd, RTellerVent, '116', '', '', '', '', '', '']);
    //     for (var tellerVent = 1; tellerVent < pageBuilding.VentPerAfd - 1; tellerVent++){
    //         LTellerVent++;
    //         RTellerVent++;
    //         table.table.body.push(['', LTellerVent, '112', '', '', '', '', '', '', '', RTellerVent, '116', '', '', '', '', '', '']);
    //     }
    //     LTellerVent++;
    //     RTellerVent++;
    //     table.table.body.push(['', LTellerVent, '112', '', '', '', '', '', '', '', RTellerVent, '116', '', '', '', '', '', '']);
    //     LTellerVent++;
    //     RTellerVent++;
    // }

    var table = {
        table: {
            headerRows: 1,
            widths: [20, 15, '*', '*', '*', '*', '*', '*', '*', 20, 15, '*', '*', '*', '*', '*', '*', '*'],

            body: []
        }, layout: {
				hLineWidth: function (i, node) {
					// return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    return 0.1;
				},
				vLineWidth: function (i, node) {
					// return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    return 0.1;
				},
				hLineColor: function (i, node) {
					// return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    return 'black';
				},
				vLineColor: function (i, node) {
					// return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                    return 'black';
				},
				// hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				paddingLeft: function(i, node) { return 5; },
				paddingRight: function(i, node) { return 5; },
				paddingTop: function(i, node) { return 0.2; },
				paddingBottom: function(i, node) { return 0.2; },
				// fillColor: function (rowIndex, node, columnIndex) { return null; }
			}
    };

    buildPage(table, pageBuilding, inputData);
    docDefenition.content.push({text: 'Weeknummer: ', alignment: 'center', style: 'subheader'});
    docDefenition.content.push(table);
    
    table = {
        table: {
            headerRows: 1,
            heights: 10,
            widths: [20, 15, '*', '*', '*', '*', '*', '*', '*', 20, 15, '*', '*', '*', '*', '*', '*', '*'],

            body: []
        }
    };
    buildPage(table, pageBuilding2, inputData);
    docDefenition.content.push({text: 'Weeknummer: ', pageBreak: 'before', alignment: 'center', style: 'subheader'});
    docDefenition.content.push(table);

    console.log(docDefenition);

    var pdfDoc = printer.createPdfKitDocument(docDefenition, option);
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();
    console.log(inputData);
}

function buildPage(targetTable, pageInfo, inputData)
{
    var LTellerVent = pageInfo.LStartVent;
    var RTellerVent = pageInfo.RStartVent;

    targetTable.table.body.push([ {text: pageInfo.name, colSpan: 2, alignment: 'center'}, {}, 'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo', {text: '', colSpan: 2, alignment: 'center'}, {}, 'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']);

    if (pageInfo.afUp == true) {
        for (var LTellerAfd = pageInfo.LStartAfd, RTellerAfd = pageInfo.RStartAfd; ((pageInfo.LStartAfd + pageInfo.LAantalAfd) > LTellerAfd) || ((pageInfo.RStartAfd + pageInfo.RAantalAfd) > RTellerAfd); LTellerAfd++, RTellerAfd++) {
            buildTable(targetTable, pageInfo, inputData, LTellerAfd, RTellerAfd, LTellerVent, RTellerVent);
            LTellerVent += pageInfo.VentPerAfd;
            RTellerVent += pageInfo.VentPerAfd;
        }
    } else {
        for (var LTellerAfd = pageInfo.LStartAfd, RTellerAfd = pageInfo.RStartAfd; ((pageInfo.LStartAfd - pageInfo.LAantalAfd) < LTellerAfd) || ((pageInfo.RStartAfd - pageInfo.RAantalAfd) < RTellerAfd); LTellerAfd--, RTellerAfd--) {
            buildTable(targetTable, pageInfo, inputData, LTellerAfd, RTellerAfd, LTellerVent, RTellerVent);
            LTellerVent += pageInfo.VentPerAfd;
            RTellerVent += pageInfo.VentPerAfd;
        }
    }
}

function buildTable(targetTable, pageInfo, inputData, LTellerAfd, RTellerAfd, LTellerVent, RTellerVent) {
    
    targetTable.table.body.push([LTellerAfd, LTellerVent, '112', '', '', '', '', '', '', RTellerAfd, RTellerVent, '116', '', '', '', '', '', '']);
    for (var tellerVent = 1; tellerVent < pageInfo.VentPerAfd - 1; tellerVent++){
        LTellerVent++;
        RTellerVent++;
        targetTable.table.body.push(['', LTellerVent, '112', '', '', '', '', '', '', '', RTellerVent, '116', '', '', '', '', '', '']);
    }
    LTellerVent++;
    RTellerVent++;
    targetTable.table.body.push(['', LTellerVent, '112', '', '', '', '', '', '', '', RTellerVent, '116', '', '', '', '', '', '']);
    LTellerVent++;
    RTellerVent++;
}

module.exports = { createPDF };
