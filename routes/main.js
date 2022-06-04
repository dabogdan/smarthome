const dbQuery = require("../database");

let deviceTypesArr = [];

module.exports = function (app) {
    //routes for the home and about pages
    app.get("/", (req, res) => res.render("home.html"));
    app.get("/about", (req, res) => res.render("about.html"));
    //route and the endpoint for Add Device Page to render the device types into the select input
    app.get("/add-device", (req, res) => {
        dbQuery('SELECT name, traits FROM deviceTypes;').then((data) => {
            res.render("add.ejs", devicesArr = data);
            //make separate variable in order to store the
            // array of JSON data for dynamic rendering and without the page reload
            deviceTypesArr = data;
        })
    })
    //"Add device" POST-endpoint storing the form inputs into the database and
    // returning the result page with success or error
    app.post("/added", (req, res) => {
        //create object from the form and use it in the query
        const {deviceName, deviceType, ...inputValues} = req.body;
        dbQuery('INSERT INTO userDevices SET ?', {
            name: deviceName,
            deviceType: deviceType,
            traits: JSON.stringify(inputValues)
        })
            //return the result template page with the message of the result
            .then(() => {
                res.render("result.ejs", result = {
                    header: deviceName,
                    body: `You have successfully stored your device "${deviceName}" with the type: "${deviceType}"!`,
                })
            })
            .catch((err) => {
                `There was an error: ${err}`;
                res.render("result.ejs", result = {
                    header: "Error occurred",
                    body: err,
                })
            });
    });
    //endpoint to retrieve names of all user devices for the dropdown input with the list of devices
    app.get("/status", (req, res) => {
        dbQuery('SELECT name FROM userDevices;')
            .then((data) => {
                res.render("status.ejs", devices = data);
            })
            .catch((err) => console.log(err));
    })
    //endpoint using device name to find and retrieve status of the device
    app.get("/device-status", (req, res) => {
        const selectedDeviceName = req.query.selectedDevice;
        dbQuery('SELECT * FROM userDevices WHERE ?', {name: selectedDeviceName})
            .then((data) => {
                if (data.length === 0) {
                    return false;
                } else {
                    return data[0];
                }
            }).then((deviceObj) => {
            res.render("status.ejs", {
                deviceSelected: deviceObj,
                traits: deviceObj.traits
            });
        })
            .catch((err) => console.log(err));
    })
    //control page endpoint
    app.get("/control", (req, res) => {
        dbQuery('SELECT name, deviceType, traits FROM userDevices;').then((data) => {
            res.render("control.ejs", devicesArr = data);
            //make separate variable in order to store the
            // array of JSON data for dynamic rendering and without the page reload
            deviceTypesArr = data;
        })
    })
    //page for the result of "device control page" manipulations
    app.post("/changed", (req, res) => {
        //create object from the form and use it in the query
        const {deviceName, ...inputValues} = req.body;
        dbQuery("UPDATE userDevices SET name = ?, traits = ? WHERE name = ?;", [
            deviceName[1],
            JSON.stringify(inputValues),
            deviceName[0]
        ])
            //return the result template page with the message of the result
            .then(() => {
                res.render("result.ejs", result = {
                    header: deviceName[0],
                    body: `You have successfully updated your device "${deviceName[0]}"!`,
                })
            })
            .catch((err) => {
                `There was an error: ${err}`;
                res.render("result.ejs", result = {
                    header: "Error occurred",
                    body: err,
                })
            });
    });
    //delete page endpoint
    app.get("/delete", (req, res) => {
        dbQuery('SELECT name FROM userDevices;')
            .then((data) => {
                res.render("delete.ejs", devices = data);
            })
            .catch((err) => console.log(err));
    })
    //page for the result of deletion
    app.post("/deleted", (req, res) => {
        const name = req.body.selectedDevice;
        dbQuery("DELETE FROM userDevices WHERE name = ?;", name)
            //return the result template page with the message of the result
            .then(() => {
                res.render("result.ejs", result = {
                    header: name,
                    body: `You have successfully deleted your device "${name}"!`,
                })
            })
            .catch((err) => {
                `There was an error: ${err}`;
                res.render("result.ejs", result = {
                    header: "Error occurred",
                    body: err,
                })
            });
    });
}