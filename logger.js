//
// im myObject we have a reading
//
const mysql = require('mysql');
let connectionInfo = {};
let logger = {};
const C9_SQL_server = process.env.C9_SQL_server;





function errConn(err)
{
    if( !err )
    {
       // console.log(`connected! Preparing data`);
    }
    else
    {
        console.log(`connection failed. Reason: [${err.code}]. Fatal: ${err.fatal}`);
    }
    return;
}





function dbInfo(C9_SQL_server)
{
        // if under C9 fills in database connection info as needed
        if ( C9_SQL_server && C9_SQL_server.length > 0)
        {
            //console.log("Using C9-provided mySQL server");
            connectionInfo =
                {
                    host: 'localhost',
                    port: 3306,
                    user: 'arfneto',
                    password: '',
                    database: 'cars'
                };
        }
        else
        {
            //console.log("Using private mySQL server");
            connectionInfo =
                {
                    host: 'h03332-000.ddns.net',
                    port: 6612,
                    user: 'arfneto',
                    password: 'easy',
                    database: 'join_us'
                };
        }
        return connectionInfo;
}  // end function dbON





logger.logThis = 
    function ( OneReading )
    {
        //console.log(`logger:`);
        connectionInfo = dbInfo(C9_SQL_server);
        let connection = mysql.createConnection( connectionInfo );
        connection.connect(errConn);
        let info =
        { 
            code:           OneReading.veiculo.codveic,
            plate:          OneReading.veiculo.placa,
            timeOfReading:  OneReading.veiculo.data,
            ignition:       OneReading.veiculo.ignicao,
            kmInfo:         OneReading.veiculo.odometro,
            speed:          OneReading.veiculo.velocidade,
            s1:             OneReading.veiculo.s1,
            s2:             OneReading.veiculo.s2,
            tension:        OneReading.veiculo.tensao,
            LAT:            OneReading.veiculo.latitude,
            LNG:            OneReading.veiculo.longitude,
            address:        OneReading.veiculo.endereco,
            vehicleType:    OneReading.veiculo.tipoveic,
            course:         OneReading.veiculo.curso,
            rpm:            OneReading.veiculo.rpm,
            deviceID:       OneReading.veiculo.id_disp
        };
        let end_result = connection.query
        (
            'INSERT INTO veiculos SET ?',
            info,
            function ( err, result )
            {
                if(err) throw err;
 //               console.log( `Result is ${end_result}` );
            }
        ); 
        connection.end();
        return OneReading.veiculo.placa; 
    };   // end function logThis()

module.exports = logger;