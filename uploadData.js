
const { InfluxDB } = require('@influxdata/influxdb-client')
const { Pool } = require('pg')
const format = require('pg-format');

// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'rz111C25qcpYXk1bKwBFn_mzMku8gRMDsv5M5ZGPpttpUoEPQYGS_2YCyCChG818PBZpCImzbSHLC1xTrWt_Jw=='
const org = 'Bruneel CommV'
const bucket = 'varkens'

const client = new InfluxDB({ url: 'http://192.168.0.21:8086', token: token })

const { Point } = require('@influxdata/influxdb-client')

const pool = new Pool({
    user: 'postgres',
    host: '192.168.0.21',
    database: 'varkens',
    password: 'password',
    port: 5431,
});

function sendToInflux(data, dataDate) {
    var splitString, stal, afdeling, ventiel, year, month, day, dataDateOut, point;
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({ host: 'host1' });
    console.log(data);
    data.forEach(row => {
        // split the location in seperated parts
        splitString = row['Locatie'].split(" ");
        stal = splitString[2];
        afdeling = splitString[7];
        ventiel = splitString[12];

        // splitString = dataDate.split("-");
        // year = splitString[2];
        // month = splitString[1];
        // day = splitString[0];
        // dataDateOut = new Date(year, month, day);
        dataDateOut = new Date(dataDate);
        //console.log(dataDateOut);
        // write point
        point = addPoint(stal, afdeling, ventiel, row['Voerfase'], row['Voercurve'], row['Curvedag'], row['Datum plaatsing in stal'], row['Basisaanp. [%]'], dataDateOut);
        writeApi.writePoint(point);
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

async function sendToPostgress(data, dataDate) {
    var values = [];
    var splitString, stal, afdeling, ventiel, year, month, day, dataDateOut;

    data.forEach(row => {
        var rij = [];
        // split the location in seperated parts
        splitString = row['Locatie'].split(" ");
        stal = splitString[2];
        afdeling = splitString[7];
        ventiel = splitString[12];

        splitString = row['Datum plaatsing in stal'].split("-");
        year = splitString[2];
        month = splitString[1];
        day = splitString[0];
        dataDateOut = new Date(year, month, day);

        rij[0] = stal;              // stal
        rij[1] = afdeling;          // afdeling
        rij[2] = ventiel;           // ventiel
        rij[3] = row['Voerfase'];   // recept
        rij[4] = row['Voercurve'];                  // voercurve
        rij[5] = dataDateOut;                  // datumPlaatsing
        rij[6] = row['Curvedag'];                  // curveDag
        rij[7] = row['Basisaanp. [%]'];                  // Basisaanp
        rij[8] = dataDate;                  // datumSample
        rij[9] = row['DM88%  [kg]'];                  // DM88%
            
        values.push(rij);
    });
    // console.log(row);
    console.log(values);

    // you can also use async/await
    const res = await pool.query(format('INSERT INTO "ventielHistory"(stal, afdeling, ventiel, recept, voercurve, "datumPlaatsing", "curveDag", "Basisaanp", "datumSample", "DM88%") VALUES %L', values));
    console.log(res);
    await pool.end();
}

function addPoint(stal, afdeling, ventiel, recept, voercurve, curvedag, datumPlaatsing, Basisaanp, dataDate) {
    const point = new Point('voercurveTest')
        .tag('stal', stal)
        .tag('afdeling', afdeling)
        .tag('ventiel', ventiel)
        .tag('recept', recept)
        .tag('voercurve', voercurve)
        .tag('datumPlaatsing', datumPlaatsing)
        .tag('curveDag', curvedag)
        .intField('Basisaanp', Basisaanp)
        .timestamp(dataDate);
    return point
}

module.exports = { sendToInflux, sendToPostgress };
