
const { InfluxDB } = require('@influxdata/influxdb-client')

// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'rz111C25qcpYXk1bKwBFn_mzMku8gRMDsv5M5ZGPpttpUoEPQYGS_2YCyCChG818PBZpCImzbSHLC1xTrWt_Jw=='
const org = 'Bruneel CommV'
const bucket = 'varkens'

const client = new InfluxDB({ url: 'http://192.168.0.21:8086', token: token })

const {Point} = require('@influxdata/influxdb-client')
const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({ host: 'host1' });

function sendToInflux(data, dataDate) {
    var splitString, stal, afdeling, ventiel, recept, voercurve;
    // console.log(data);
    data.forEach(row => {
        // split the location in seperated parts
        splitString = row['Locatie'].split(" ");
        stal = splitString[2];
        afdeling = splitString[7];
        ventiel = splitString[12];

        // write point
        addPoint(stal, afdeling, ventiel, row['Voerfase'], row['Voercurve'], row['Curvedag'], row['Datum plaatsing in stal'], row['Basisaanp. [%]']);
    });
    writeApi
        .close()
        .then(() => {
            console.log('FINISHED')
        })
        .catch(e => {
            console.error(e)
            console.log('Finished ERROR')
        });
}

function addPoint(stal, afdeling, ventiel, recept, voercurve, curvedag, datumPlaatsing, Basisaanp) {
    const point = new Point('test')
        .tag('stal', stal)
        .tag('afdeling', afdeling)
        .tag('ventiel', ventiel)
        .tag('recept', recept)
        .tag('voercurve', voercurve)
        .tag('datumPlaatsing', datumPlaatsing)
        .floatField('curveDag', curvedag)
        .floatField('Basisaanp', Basisaanp);
    writeApi.writePoint(point);
}

module.exports = { sendToInflux };
