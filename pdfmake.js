
// Define font files
var fonts = {
  Roboto: {
    normal: './fonts/Roboto-Regular.ttf',
    bold: './fonts/Roboto-Medium.ttf',
    italics: './fonts/Roboto-Italic.ttf',
    bolditalics: './fonts/Roboto-MediumItalic.ttf'
  }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const { dialog } = require('electron');
var fs = require('fs');

var pageBuilding = [{
        name: 'Stal 4',
        fontSize: 9.1,
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
        fontSize: 9.1,
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
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
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

async function createPDF(inputData, savePath) {
    // start building the page
    var docDefenition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [5, 5, 5, 5],
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
                    paddingBottom: function (i, node) { return 0.1; },
                    defaultBorder: false
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
    console.log(savePath);
    pdfDoc.pipe(fs.createWriteStream(savePath)).on( 'error', function(err){
        dialog.showMessageBox({
            title: "Save file",
            icon: __dirname + '/translate.png',
            message: "someting worng: " + err
        });
    });
    pdfDoc.end();

    return docDefenition;
}

function buildPage(targetTable, pageInfo, inputData)
{
    var LTellerVent = pageInfo.LStartVent;
    var RTellerVent = pageInfo.RStartVent;

    targetTable.table.body.push([{
                text: pageInfo.name,                // L afdeling
                border: [false, false, true, true],
                alignment: 'center',
                colSpan: 2
            }, {
                border: [true, true, true, true],   // L ventiel nummer
                text: ''
            }, {
                border: [true, true, true, true],   // L ventiel waarde
                text: 'ma'
            }, {
                border: [true, true, true, true],
                text: 'di'
			}, {
                border: [true, true, true, true],
                text: 'wo'
            }, {
                border: [true, true, true, true],
                text: 'do'
            }, {
                border: [true, true, true, true],
                text: 'vr'
            }, {
                border: [true, true, true, true],
                text: 'za'
            }, {
                border: [true, true, true, true],
                text: 'zo'
            }, {
                border: [true, false, true, true], // R afdeling
                text: '',
                alignment: 'center',
                colSpan: 2
            }, {
                border: [true, true, true, true], // R ventiel nummer
                text: ''
            }, {
                border: [true, true, true, true], // R ventiel waarde
                text: 'ma'
            }, {
                border: [true, true, true, true],
                text: 'di'
            }, {
                border: [true, true, true, true],
                text: 'wo'
            }, {
                border: [true, true, true, true],
                text: 'do'
            }, {
                border: [true, true, true, true],
                text: 'vr'
            }, {
                border: [true, true, true, true],
                text: 'za'
            }, {
                border: [true, true, true, true],
                text: 'zo'
            }]);

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
        targetTable.table.body.push([{
                text: '',                           // L afdeling
                rowSpan: pageInfo.VentPerAfd,
                border: [false, false, false, false],
                alignment: 'center'
            }, {
                border: [false, false, false, false],   // L ventiel nummer
                text: ''
            }, {
                border: [false, false, false, false],   // L ventiel waarde
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
			}, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                rowSpan: pageInfo.VentPerAfd,       // R afdeling
                border: [true, true, true, true],
                text: RTellerAfd,
                alignment: 'center'
            }, {
                border: [true, true, true, true], // R ventiel nummer
                text: RTellerVent
            }, {
                border: [true, true, true, true], // R ventiel waarde
                text: RventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }]);
    } else if (pageInfo.RafUp ? (RTellerAfd >= pageInfo.RStartAfd + pageInfo.RAantalAfd) : (RTellerAfd <= pageInfo.RStartAfd - pageInfo.RAantalAfd)) {
        LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
        targetTable.table.body.push([{
                text: LTellerAfd,                   // L afdeling
                rowSpan: pageInfo.VentPerAfd,
                border: [true, true, true, true],
                alignment: 'center'
            }, {
                border: [true, true, true, true],   // L ventiel nummer
                text: LTellerVent
            }, {
                border: [true, true, true, true],   // L ventiel waarde
                text: LventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
			}, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                rowSpan: pageInfo.VentPerAfd,       // R afdeling
                border: [false, false, false, false],
                text: '',
                alignment: 'center'
            }, {
                border: [false, false, false, false], // R ventiel nummer
                text: ''
            }, {
                border: [false, false, false, false], // R ventiel waarde
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }]);
    } else {
        LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
        RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
        targetTable.table.body.push([{
                text: LTellerAfd,                           // L afdeling
                rowSpan: pageInfo.VentPerAfd,
                border: [true, true, true, true],
                alignment: 'center'
            }, {
                border: [true, true, true, true],   // L ventiel nummer
                text: LTellerVent
            }, {
                border: [true, true, true, true],   // L ventiel waarde
                text: LventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
			}, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                rowSpan: pageInfo.VentPerAfd,       // R afdeling
                border: [true, true, true, true],
                text: RTellerAfd,
                alignment: 'center'
            }, {
                border: [true, true, true, true], // R ventiel nummer
                text: RTellerVent
            }, {
                border: [true, true, true, true], // R ventiel waarde
                text: RventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }]);
    }
    for (var tellerVent = 1; tellerVent < pageInfo.VentPerAfd; tellerVent++){
        LTellerVent++;
        RTellerVent++;
        if (pageInfo.LafUp ? (LTellerAfd >= pageInfo.LStartAfd + pageInfo.LAantalAfd) : (LTellerAfd <= pageInfo.LStartAfd - pageInfo.LAantalAfd))
        {
            RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
            targetTable.table.body.push([{
                text: '',                           // L afdeling
                rowSpan: pageInfo.VentPerAfd,
                border: [false, false, false, false],
                alignment: 'center'
            }, {
                border: [false, false, false, false],   // L ventiel nummer
                text: ''
            }, {
                border: [false, false, false, false],   // L ventiel waarde
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
			}, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                rowSpan: pageInfo.VentPerAfd,       // R afdeling
                border: [true, true, true, true],
                text: '',
                alignment: 'center'
            }, {
                border: [true, true, true, true], // R ventiel nummer
                text: RTellerVent
            }, {
                border: [true, true, true, true], // R ventiel waarde
                text: RventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }]);
        } else if (pageInfo.RafUp ? (RTellerAfd >= pageInfo.RStartAfd + pageInfo.RAantalAfd) : (RTellerAfd <= pageInfo.RStartAfd - pageInfo.RAantalAfd)) {
            LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
            targetTable.table.body.push([{
                text: '',                           // L afdeling
                rowSpan: pageInfo.VentPerAfd,
                border: [true, true, true, true],
                alignment: 'center'
            }, {
                border: [true, true, true, true],   // L ventiel nummer
                text: LTellerVent
            }, {
                border: [true, true, true, true],   // L ventiel waarde
                text: LventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
			}, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                rowSpan: pageInfo.VentPerAfd,       // R afdeling
                border: [false, false, false, false],
                text: '',
                alignment: 'center'
            }, {
                border: [false, false, false, false], // R ventiel nummer
                text: ''
            }, {
                border: [false, false, false, false], // R ventiel waarde
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }, {
                border: [false, false, false, false],
                text: ''
            }]);
        } else {
            LventWaarde = searchVentielWaarde(inputData, pageInfo.name, LTellerAfd, LTellerVent);
            RventWaarde = searchVentielWaarde(inputData, pageInfo.name, RTellerAfd, RTellerVent);
            targetTable.table.body.push([{
                text: '',                           // L afdeling
                rowSpan: pageInfo.VentPerAfd,
                border: [true, true, true, true],
                alignment: 'center'
            }, {
                border: [true, true, true, true],   // L ventiel nummer
                text: LTellerVent
            }, {
                border: [true, true, true, true],   // L ventiel waarde
                text: LventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
			}, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                rowSpan: pageInfo.VentPerAfd,       // R afdeling
                border: [true, true, true, true],
                text: '',
                alignment: 'center'
            }, {
                border: [true, true, true, true], // R ventiel nummer
                text: RTellerVent
            }, {
                border: [true, true, true, true], // R ventiel waarde
                text: RventWaarde
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }, {
                border: [true, true, true, true],
                text: ''
            }]);
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
