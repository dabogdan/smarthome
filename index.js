const express = require("express");
const port = 8089;
const app = express();
const bodyParser = require("body-parser");
//database connection as a separate file
const database = require("./database");

//enable to open files in the browser
app.use(express.static('public'));

//body parser of the file
app.use(bodyParser.urlencoded({extended: true}));

// routers
require("./routes/main")(app);

//listening at 8089
app.listen(port, (err) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log(`MySmartHome app is listening at port: ${port}`)
    }
})

//ejs engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//create default tables in database, if they were not created before.
// It is asynchronous so does not block any script execution
const defaultTables = require("./defaultTables");
defaultTables()
    .then(() => console.log("Default tables in database are created."))
    .catch((err) => console.log(err));