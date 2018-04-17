
require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

if(process.env.TEST)
{
    console.log("***** " + process.env.TEST + " *****");
}

if(process.env.KEY_ONE)
{
    console.log("***** key loaded: Proceeding *****");
}
else
{
    console.log("key not found");
    return
}

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get(
    "/",
    function(req, res)
    {
        res.render("MapTest-1", { KEY_ONE: process.env.KEY_ONE });
    }
    );
    
app.listen(    process.env.PORT,     process.env.IP, 
    function()
    {
       console.log("Maps test started!");
    }
    );