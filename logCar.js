
require('dotenv').config();

var bodyParser = require("body-parser");
var express =   require("express");
var rp =        require("request-promise-native");

const myLog =   require("./logger.js");

var app = express();

var mobiData = "";


const car1 =
{
"veiculo": 
    {
        "codveic": "188",
        "placa": "329349",
        "data": "2018-04-18 17:59:16",
        "ignicao": "OFF",
        "odometro": "24",
        "velocidade": "0",
        "s1": "OFF",
        "s2": "OFF",
        "tensao": "22.60",
        "latitude": "-22.908945",
        "longitude": "-47.083518",
        "endereco": "AV. PASCOAL CELESTINO SOARES, 411 - JARDIM BONFIM, CAMPINAS - SP, 13032-540",
        "tipoveic": "0",
        "curso": "0",
        "rpm": "0",
        "id_disp": "329349"
    }
};

const car2 =
{
"veiculo": 
    {
        "codveic": "189",
        "placa": "329349",
        "data": "2018-04-18 17:59:16",
        "ignicao": "OFF",
        "odometro": "24",
        "velocidade": "0",
        "s1": "OFF",
        "s2": "OFF",
        "tensao": "22.60",
        "latitude": "-22.908945",
        "longitude": "-47.083518",
        "endereco": "AV. PASCOAL CELESTINO SOARES, 411 - JARDIM BONFIM, CAMPINAS - SP, 13032-540",
        "tipoveic": "0",
        "curso": "0",
        "rpm": "0",
        "id_disp": "329349"
    }
};

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

let result = myLog.logThis( car1 );
console.log( `Car log returned ${result}`);

result = myLog.logThis( car2 );
console.log( `Car log returned ${result}`);

for( let i = 1; i < 6; i++)
{
    let p = 0;
    p = parseInt(car1.veiculo.placa, 10);
    p += i;
    console.log(`placa ${car1.veiculo.placa} p ${p}`);
    car1.veiculo.placa = p.toString(10);
    result = myLog.logThis( car1 );
    console.log( `Car ${i} log returned ${result}`);
}   // end for
