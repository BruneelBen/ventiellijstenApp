
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

var pageBuilding = [{
        name: 'Stal 4',
        fontSize: 8.5,
        LafUp: true,
        RafUp: true,
        VentPerAfd: 10,
        LStartVent: 1,
        LStartAfd: 40,
        LAantalAfd: 5,
        RStartVent: 51,
        RStartAfd: 45,
        RAantalAfd: 5
    },
        {
        name: 'Stal 4',
        fontSize: 8.5,
        LafUp: false,
        RafUp: false,
        VentPerAfd: 10,
        LStartVent: 101,
        LStartAfd: 39,
        LAantalAfd: 5,
        RStartVent: 151,
        RStartAfd: 34,
        RAantalAfd: 4
    },
    {
        name: 'Stal 2',
        fontSize: 10,
        LafUp: true,
        RafUp: false,
        VentPerAfd: 4,
        LStartVent: 1,
        LStartAfd: 12,
        LAantalAfd: 6,
        RStartVent: 25,
        RStartAfd: 11,
        RAantalAfd: 6
    },
    {
        name: 'Stal 3',
        fontSize: 10,
        LafUp: true,
        RafUp: false,
        VentPerAfd: 5,
        LStartVent: 1,
        LStartAfd: 24,
        LAantalAfd: 6,
        RStartVent: 31,
        RStartAfd: 23,
        RAantalAfd: 6
    },
    {
        name: 'Stal 5',
        fontSize: 10,
        LafUp: true,
        RafUp: true,
        VentPerAfd: 8,
        LStartVent: 1,
        LStartAfd: 50,
        LAantalAfd: 3,
        RStartVent: 25,
        RStartAfd: 53,
        RAantalAfd: 3
    },
    {
        name: 'Stal 5',
        fontSize: 10,
        LafUp: false,
        RafUp: false,
        VentPerAfd: 8,
        LStartVent: 49,
        LStartAfd: 61,
        LAantalAfd: 3,
        RStartVent: 73,
        RStartAfd: 58,
        RAantalAfd: 3
    }];

async function createPDF(inputData) {
    // start building the page
    var docDefenition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [10, 10, 10, 10],
        styles: {},
        defaultStyle: {
            fontSize: 10
        },
        content: []
    };
    var option = {

    };

    // add lineheigts to document
    pageBuilding.forEach((page, index) => {
        docDefenition.styles["page"+index] = {fontSize: page.fontSize, bold: false};
    });

    // each page building
    pageBuilding.forEach((page, index) => {
        // table preparing
        var table = {
            style: "page"+index,
            table: {
                headerRows: 1,
                widths: [20, 20, '*', '*', '*', '*', '*', '*', '*', 20, 20, '*', '*', '*', '*', '*', '*', '*'],

                body: []
            }, layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i == 1 || i === node.table.body.length || (i - 1) % page.VentPerAfd == 0) ? 2 : 0.1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i == 1 || i == 2 || i == 9 || i == 10 || i == 11 || i === node.table.widths.length) ? 2 : 0.1;
                    },
                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'black';
                    },
                    paddingLeft: function(i, node) { return 5; },
                    paddingRight: function(i, node) { return 5; },
                    paddingTop: function(i, node) { return 0.1; },
                    paddingBottom: function(i, node) { return 0.1; },
                }
        };
        // build the table feurer with input Data
        buildPage(table, page, inputData);
        // print the weeknumber on the page if not the first one then with and page
        if (index == 0) {
            docDefenition.content.push({ text: 'Weeknummer: ', alignment: 'center', style: 'subheader' });
        } else {
            docDefenition.content.push({text: 'Weeknummer: ', pageBreak: 'before', alignment: 'center', style: 'subheader'});
        }
        // print table on the page
        docDefenition.content.push(table);
    });

    console.log(docDefenition);

    // save the document
    var pdfDoc = printer.createPdfKitDocument(docDefenition, option);
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();
}

function buildPage(targetTable, pageInfo, inputData)
{
    var LTellerVent = pageInfo.LStartVent;
    var RTellerVent = pageInfo.RStartVent;

    targetTable.table.body.push([ {text: pageInfo.name, colSpan: 2, alignment: 'center'}, {}, 'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo', {text: '', colSpan: 2, alignment: 'center'}, {}, 'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']);

    for (var LTellerAfd = pageInfo.LStartAfd, RTellerAfd = pageInfo.RStartAfd;
        (pageInfo.LafUp ? ((pageInfo.LStartAfd + pageInfo.LAantalAfd) > LTellerAfd) : ((pageInfo.LStartAfd - pageInfo.LAantalAfd) < LTellerAfd)) ||     // nakijken of op of af moet lopen
        (pageInfo.RafUp ? ((pageInfo.RStartAfd + pageInfo.RAantalAfd) > RTellerAfd) : ((pageInfo.RStartAfd - pageInfo.RAantalAfd) < RTellerAfd));
        (pageInfo.LafUp ? LTellerAfd++ : LTellerAfd--),
        (pageInfo.RafUp ? RTellerAfd++ : RTellerAfd--)) {
        buildTable(targetTable, pageInfo, inputData, LTellerAfd, RTellerAfd, LTellerVent, RTellerVent);
        LTellerVent += pageInfo.VentPerAfd;
        RTellerVent += pageInfo.VentPerAfd;
    }
}

function buildTable(targetTable, pageInfo, inputData, LTellerAfd, RTellerAfd, LTellerVent, RTellerVent) {
    var LventWaarde, RventWaarde;
    if (pageInfo.LafUp ? (LTellerAfd >= pageInfo.LStartAfd + pageInfo.LAantalAfd) : (LTellerAfd <= pageInfo.LStartAfd - pageInfo.LAantalAfd))
    {
        RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
        targetTable.table.body.push(['', '', '', '', '', '', '', '', '', {text: RTellerAfd, rowSpan: pageInfo.VentPerAfd, alignment: 'center'}, RTellerVent, RventWaarde, '', '', '', '', '', '']);
    } else if (pageInfo.RafUp ? (RTellerAfd >= pageInfo.RStartAfd + pageInfo.RAantalAfd) : (RTellerAfd <= pageInfo.RStartAfd - pageInfo.RAantalAfd)) {
        LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
        targetTable.table.body.push([{text: LTellerAfd, rowSpan: pageInfo.VentPerAfd, alignment: 'center'}, LTellerVent, LventWaarde, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    } else {
        LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
        RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
        targetTable.table.body.push([{text: LTellerAfd, rowSpan: pageInfo.VentPerAfd, alignment: 'center'}, LTellerVent, LventWaarde, '', '', '', '', '', '', {text: RTellerAfd, rowSpan: pageInfo.VentPerAfd, alignment: 'center'}, RTellerVent, RventWaarde, '', '', '', '', '', '']);
    }
    for (var tellerVent = 1; tellerVent < pageInfo.VentPerAfd; tellerVent++){
        LTellerVent++;
        RTellerVent++;
        if (pageInfo.LafUp ? (LTellerAfd >= pageInfo.LStartAfd + pageInfo.LAantalAfd) : (LTellerAfd <= pageInfo.LStartAfd - pageInfo.LAantalAfd))
        {
            RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
            targetTable.table.body.push(['', '', '', '', '', '', '', '', '', '', RTellerVent, RventWaarde, '', '', '', '', '', '']);
        } else if (pageInfo.RafUp ? (RTellerAfd >= pageInfo.RStartAfd + pageInfo.RAantalAfd) : (RTellerAfd <= pageInfo.RStartAfd - pageInfo.RAantalAfd)) {
            LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
            targetTable.table.body.push(['', LTellerVent, LventWaarde, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        } else {
            LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
            RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
            targetTable.table.body.push(['', LTellerVent, LventWaarde, '', '', '', '', '', '', '', RTellerVent, RventWaarde, '', '', '', '', '', '']);
        }
    }
    LTellerVent++;
    RTellerVent++;
}

function searchVentielWaarde(inputData, stal, afdeling, ventiel) {
    var ventielWaarde = '';

    for (var vent in inputData) {
        if (inputData[vent].Locatie == ' ' + stal +'  -  Afdeling ' + afdeling + '  -  Ventiel ' + ventiel) {
            ventielWaarde = inputData[vent]['Basisaanp. [%]'];
        }
    }

    return ventielWaarde;
}

module.exports = { createPDF };
