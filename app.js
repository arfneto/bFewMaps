
require('dotenv').config();

var bodyParser = require("body-parser");
var express =   require("express");
var request =   require("request");
var rp =        require("request-promise-native");

const myLog =   require("./logger.js");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get(
    "/",
    function(req, res)
    {
        res.render(
            "MapTest-1",
            { 
                KEY_ONE:        process.env.KEY_ONE,
                From_Mobi:      "no data"
            });
    }
    );
    
app.listen
(    
    process.env.PORT,
    process.env.IP, 
    function()
    {
       console.log("Maps test started!");
    }
);