
// required librys
const electron = require('electron');
const path = require("path");
const fs = require("fs");

// make a class manage config savement
class store {
    constructor() {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.path = path.join(userDataPath, 'config.json');
        this.read();
    }

    // read config file
    read() {
        this.data = JSON.parseDataFile(this.path);
    }

    // save config file
    write() {
        fs.writeFileSync(this.path, JSON.stringify(this.data));
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
        var data = this.data[elmentId];
        if (data == null) {
            return false;
        }
        this.data[elmentId] = jsonString;
        return true;
    }

    // delete a element
    removeElement(elementId) {
        this.data[elementId].removeElement;
    }

    // add a new element
    addElement(elmentId, jsonString) {
        var data = this.data[elmentId];
        if (data == null) {
            this.data[elmentId] = jsonString;
            return true;
        }
        return false;
    }
}

// export the function for other functions tu use
module.exports = { store };
