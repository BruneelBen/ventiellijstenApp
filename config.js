
// required librys
const { app, dialog } = require('electron');
const path = require("path");
const fs = require("fs");
const { exit } = require('process');

// make a class manage config savement
class store {
    constructor() {
        this.path = path.join('./config.json');
        this.read();
    }

    // read config file
    read() {
        try {
            this.data = JSON.parse(fs.readFileSync(this.path));
        } catch (error) {
            dialog.showMessageBoxSync({
                title: "can't read input file",
                icon: __dirname + '/translate.png',
                message: "Can not found the input file with settings."
            });
            console.log("ERROR: Can not found the input file with settings.");
            app.exit(-1);
        }
    }

    // save config file
    write() {
        fs.writeFileSync(this.path, JSON.stringify(this.data, null, 4));
    }

    // give all element IDs for make a overview
    getList() {
        return Object.keys(this.data);
    }

    // give the numbers of rows that there are
    Count() {
        return Object.keys(this.data).length;
    }

    // get the data of a element
    getElement(elementId) {
        return this.data[elementId];
    }

    // update the data of a element
    setElement(elmentId, jsonString) {
        if (elmentId in this.data) {
            this.data[elmentId] = jsonString;
            return true;
        }
        return false;
    }

    // delete a element
    removeElement(elementId) {
        delete this.data[elementId];
    }

    // add a new element
    addElement(elmentId, jsonString) {
        if (elmentId in this.data) {
            return false;
        }
        this.data[elmentId] = jsonString;
        return true;
    }
}

// export the function for other functions tu use
module.exports = store;
