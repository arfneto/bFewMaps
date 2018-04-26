
require('dotenv').config();

var bodyParser = require("body-parser");
var express =   require("express");
var request =   require("request");
var rp =        require("request-promise-native");

var app = express();

var mobiData = "";





function displayAnchors(a,s)
{
    //
    // display levels
    console.log
    (
        "displayAnchors(" + s + "): " +
        a.length
    );
    for(var i = 0; i < a.length; i++)
    {
        console.log
        (
            "anchors(" + i + "):\topened:(" + 
            a[i].opened +
            ") tag is <" +
            a[i].tagToClose +
            ">"
        );
        //
    }   // end for
    return;                
}   // end displayAnchors()





function getIndent(level, pos)
{
    var h0 = "";        // for the { 
    var step = "    ";    // for the field

    for (var l = 0; l < level; l++)
    {
        h0 = h0 + step;
    }
    if ( pos == 0) return h0;
    for(var i = 0; i < pos; i++)
    {
        h0 = h0 + step; 
    }
    return h0;
}   // end getIndent()





function closeLevel(level)
{
    return ("\n" + getIndent(level, 0) + "}");
}





function openLevel(level)
{
    return ("\n" + getIndent(level, 0) + "{\n");
}





function getKeyValue(
    xmlString, 
    root, 
    level
)
{
    var rootClose = "/" + root;
    var myJSON = "";
    var st = 0;
    var thisKey = "";
    var thisNode = "";
    var lastKey = "";
    var thisValue = "";
    var lastValue = "";
    
    console.log(
        "***** getKeyValue(" +
        xmlString.length +
        "): root Key is [" +
        root + 
        "] level is " + level + " *****"
    );
    if ( xmlString.length > 20)
    {
        console.log("first 30 of xml:[" + xmlString.substring(0,29) + "]");
    }
    else
    {
        console.log("xml:[" + xmlString + "]");
    }

    myJSON = openLevel(level) +
        getIndent(level,0) +
        "\"" +
        root + 
        "\": ";
        
    var anchors = [];
    var anchor = { opened: false, tagToClose: root };
    anchors.push(anchor);
    displayAnchors(anchors, "at start");
    console.log("now test");

    for( var ix = 0; ix < xmlString.length; ix++)
    {
        if(
            (xmlString.charCodeAt(ix) == 13) ||
            (xmlString.charCodeAt(ix) == 8) ||
            (xmlString.charCodeAt(ix) == 10) 
        ) 
        {
            continue;
        }
        switch (st)
        {
            case 0:
                // searching for < 
                switch (xmlString[ix])
                {
                    case '<':
                        // we are at the start of a new tag
                        // if we have a value, save it
                        if(thisNode.length>0)
                        {
                            lastValue = thisNode;
                        }
                        else
                        {
                            lastValue = "";
                        }
                        thisNode = ""; 
                        st = 1;
                        break;
                   
                    default:
                        // builds up the node value
                        thisNode = thisNode + xmlString[ix];
                         break;  // just go
                }   // end switch (xmlString[])
                break;
                
            case 1:
                // here we are building a new tag
                switch (xmlString[ix])
                {
                    case '>':
                        // we have a new tag
                        console.log
                        (
                            "\t(" + st + ") Node is <" + 
                            thisNode + "> level is (" + 
                            level + "), Anchors [" + 
                            anchors.length + "]"
                        );
                        if (thisNode[thisNode.length-1] == '/')
                        {
                            // closed tag <tag/>
                            st = 2;
                        }
                        else
                        {
                            if (thisNode[0] == '/')
                            {
                                // closing tag </tag>
                                st = 3;
                            }
                            else
                            {
                                // a new tag <newTag>
                                st = 4;
                            }
                        }
                        ix = ix - 1;    // step back
                        break;

                    default:
                        // build key
                        thisNode = thisNode + xmlString[ix];
                        break;
                }   // end switch (xmlString[])
                break;

            case 2:
                // closed tag <tag/>
                if( anchors[level].opened == false )
                {
                    // this is  the first tag at this level
                    anchors[level].opened = true;
                    level = level + 1;
                    console.log
                    (
                        "\tstarting level (" +
                        level + ")"
                    );
                    myJSON = myJSON + openLevel(level);
                    // first tag in new level
                    if ( anchors.length <= (level+1))
                    {
                        console.log
                        (
                            "\t<" + thisNode + "> first tag in level (" +
                            level + ")"
                        );
                        anchor = { opened: false, tagToClose: thisNode };
                        anchors.push(anchor);
                    }
                    else
                    {
                        console.log
                        (
                            "\t<" + thisNode + "> additional tag in level (" +
                            level + ")"
                        );
                        anchors[level].opened = false;
                        anchors[level].tagToClose = thisNode;
                    }
                }
                else
                {
                    // this is not the first tag at this level
                    level = level + 1;
                    console.log
                    (
                        "\tthis is one more tag at level (" +
                        level + ")"
                    );
                    // first tag in new level
                }
                console.log
                (
                    "\t(2) closed tag: [" + 
                    thisNode + 
                    "] level(" + 
                    level + 
                    ")"
                );
                
                if(anchors[level].opened == true)
                {
                    // not the first value in this level
                    myJSON = myJSON + ",\n";
                }
                else
                {
                    anchors[level].opened = true;
                }
                anchors[level].tagToClose = thisNode;
                myJSON = myJSON +
                    getIndent(level,1) +
                    "\"" + thisNode.substring(0, (thisNode.length-1)) + "\": ";
                // and the value is ""
                myJSON = myJSON +
                    "\"\"";
                thisNode = "";
                thisValue = "";
                level = level - 1;
                console.log("level now is (" + level + ")");
                st = 0;
                break;
                
            case 3:
                console.log("\t(3) closing tag <" + thisNode + "> level is (" + level + ")");
                // if the level is not opened, it can be blank or
                // have a value stored at lastValue
                //
                if( anchors[level].opened == false)
                {
                    myJSON = myJSON + 
                        "\"" + lastValue + "\"";
                }
                else
                {
                    // if the level is opened, we need to close
                    // the previous one
                    myJSON = myJSON + closeLevel(level+1);
                    anchors[level].opened = false; // can be reused 
                    if ( anchors.length >= level )
                    {
                        anchors[level+1].opened = false;
                        anchors[level+1].tagToClose = "";
                    }
                }
                if (level == 0)
                {
                    myJSON = myJSON + closeLevel(0);
                    return myJSON;
                }
                anchors[level].opened == false; // can be reused
                level = level - 1;
                thisNode = "";
                thisValue = "";
                st = 0;
                break;

            case 4: // new node
                console.log
                (
                    "\t(4) new tag: [" + 
                    thisNode + 
                    "] level before(" + 
                    level + 
                    ")"
                );
                if( anchors[level].opened == false )
                {
                    // this is  the first tag at this level
                    anchors[level].opened = true;
                    level = level + 1;
                    console.log
                    (
                        "\tstarting level (" +
                        level + ")"
                    );
                    myJSON = myJSON +
                        openLevel(level) + getIndent(level,1) +
                        "\"" +
                        thisNode + 
                        "\": ";
                        
                    // first tag in new level
                    if (level >= anchors.length)
                    {
                        console.log
                        (
                            "adding anchor for level (" +
                            level + ")"
                        );
                        anchor = { opened: false, tagToClose: thisNode };
                        anchors.push(anchor);
                    }
                    else
                    {
                        console.log
                        (
                            "<" + thisNode + "> additional tag in level (" +
                            level + ")"
                        );
                        anchors[level].tagToClose = thisNode;
                    }
                    displayAnchors(anchors, "on new tag st 4");
                }
                else
                {
                    // level already open
                    anchors[level].tagToClose = thisNode;
                    level = level + 1;
                     
                    myJSON = myJSON +
                        ",\n" +
                        getIndent(level,1) + 
                        "\"" +
                        thisNode + 
                        "\": ";
                    //     
                }
                thisNode = "";
                thisValue = "";
                st = 0;
                break;
                
            default:
            console.log("status is " + st );
                break;
        }   // end switch(st)
    }   // end for(ix..)
    return "";
}   // end getKeyValue()





function buildJSON(xmlString, rootTag)
{
    //
    // gets first valid NODE
    //
    var st = 0;
    var thisParm = "";
    var root = {};
    
    for( var ix = 0; ix < xmlString.length; ix++)
    {
        if(
            (xmlString.charCodeAt(ix) == 13) ||
            (xmlString.charCodeAt(ix) == 8) ||
            (xmlString.charCodeAt(ix) == 10) 
        ) 
        {
            continue;
        }
        switch (st)
        {
            case 0:
                // searching for < 
                switch (xmlString[ix])
                {
                    case '<':
                      st = 1; // pos '<'
                        break;
                   
                    default:
                        break;
                }   // end switch (xmlString[])
                break;
                
            case 1:
                // pos <, look for '/', '?', or first letter ok key
                switch (xmlString[ix])
                {
                    case '?':
                        // start instruction
                        st = 2;
                        break;
                        
                    case '>':
                        // we have a new key in thisParm
                        if( thisParm == "")
                        {
                            // sanity check: avoid <>
                            st = 0;
                        }
                        else
                        {
                            // we have a node. Can not be a closing one
                            if (thisParm[0] == '/')
                            {
                                // closing tag here is out of context
                                st = 0;
                                thisParm = "";
                            }
                            else
                            {
                                // here we have a tag, non-closing tag
                                // ending at (ix)
                                if (rootTag == "")
                                {
                                    // just return the first key found
                                    root.key = thisParm;
                                    root.start = ix + 1;
                                    return root;
                                }
                                else
                                {
                                    if ( thisParm == rootTag)
                                    {
                                        // key found
                                        root.key = thisParm;
                                        root.start = ix + 1;
                                        return root;
                                    }
                                }
                            }
                        }
                        thisParm = "";
                        st = 0
                        break;

                   default:
                        // build key
                        thisParm = thisParm + xmlString[ix];
                        break;
                }   // end switch (xmlString[])
                break;

            case 2:
                // stay here until next '?'
                if (xmlString[ix] == '?')
                {
                    st = 3;
                }
                break;
                
            case 3:
                // if we have '>' then it is the end of the field
                // else go back to st 2
                if (xmlString[ix] == '>')
                {
                    st = 0; // back to tag scan
                }
                else
                {
                    st = 2; // looking for another '?'
                }
                break;
                
            default:
            console.log("status is " + st );
                break;
        }   // end switch(st)
    }   // end for(ix..)
    root.key = "";
    root.start = -1;
     return root;
}   // end buildJSON()





if(process.env.KEY_ONE)
{
    console.log("***** key loaded: Proceeding *****");
}
else
{
    console.log("key not found");
    return;
}

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

     
//
// mobi 
//
// var mobi =
//     "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>	<ws>" +
//     "\t\n\t<msg>Acesso Negado!</msg>\n\t</ws>";
	
// var mobi = "<veiculo>" +
//     "<codveic>188</codveic>\N" +
//     "<placa>329349</placa>" +
//     "<data>2018-04-18 17:59:16</data>" +
//     "<ignicao>OFF</ignicao>" +
//     "<odometro>24</odometro>" +
//     "<horimetro/>" +
//     "<velocidade>0</velocidade>" +
//     "<s1>OFF</s1>" +
//     "<s2>OFF</s2>" + 
//     "<tensao>22.60</tensao>" +
//     "<latitude>-22.908945</latitude>" +
//     "<longitude>-47.083518</longitude>" +
//     "<endereco>AV. PASCOAL CELESTINO SOARES, 411 - JARDIM BONFIM, CAMPINAS - SP, 13032-540</endereco>" +
//     "<tipoveic>0</tipoveic>" +
//     "<rotulo/>" +
//     "<curso>0</curso>" +
//     "<rpm>0</rpm>" +
//     "<id_disp>329349</id_disp>" +
//     "<bateriabackup/> " +
//     "</veiculo>    ";
//		<teste4>Teste 4 not inline</teste4>
var mobi = "<frota>" +
    "<veiculo>" +
    "<codveic>188</codveic>\n" +
    "<placa>329349</placa>\n" +
    "<data>2018-04-18 17:59:16</data>\n" +
    "<ignicao>OFF</ignicao>\n" +
    "<odometro>24</odometro>\n" +
    "<velocidade>0</velocidade>\n" +
    "<s1>OFF</s1>" +
    "<s2>OFF</s2>" + 
    "<tensao>22.60</tensao>" +
    "<latitude>-22.908945</latitude>" +
    "<longitude>-47.083518</longitude>" +
    "<endereco>AV. PASCOAL CELESTINO SOARES, 411 - JARDIM BONFIM, CAMPINAS - SP, 13032-540</endereco>" +
    "<tipoveic>0</tipoveic>" +
    "<curso>0</curso>" +
    "<rpm>0</rpm>" +
    "<id_disp>329349</id_disp>" +
    "</veiculo>" +
    "<veiculo>" +
    "<codveic>189</codveic>\n" +
    "<placa>329349</placa>\n" +
    "<data>2018-04-18 17:59:16</data>\n" +
    "<ignicao>OFF</ignicao>\n" +
    "<odometro>24</odometro>\n" +
    "<velocidade>0</velocidade>\n" +
    "<s1>OFF</s1>" +
    "<s2>OFF</s2>" + 
    "<tensao>22.60</tensao>" +
    "<latitude>-22.908945</latitude>" +
    "<longitude>-47.083518</longitude>" +
    "<endereco>AV. PASCOAL CELESTINO SOARES, 411 - JARDIM BONFIM, CAMPINAS - SP, 13032-540</endereco>" +
    "<tipoveic>0</tipoveic>" +
    "<curso>0</curso>" +
    "<rpm>0</rpm>" +
    "<id_disp>329349</id_disp>" +
    "</veiculo>" +
    "</frota>";

if(!process.env.Mobi_srv)
{
    console.log("Mobi key, 1st part loaded");
    if(process.env.Mobi_key)
    {
        rp(process.env.Mobi_srv + process.env.Mobi_key)
        .then
        ( 
            function(xmlStuff)
            {
                mobiData = xmlStuff;
                
                console.log(
                    "OK: Mobi returned " +  
                    mobiData.length +
                    " bytes of data"
                );
                console.log(
                    mobiData
                );
                //var myThing = toJSON(xmlStuff, 0);
                console.log("toJSON returned: [" +
                    myThing +
                    "]"
                    );
            }
        )
        .catch
        (
            function(err)
            {
                console.log("Mobi return code: " + err);
            }
        );
    }
    else
    {
    console.log("Mobi key, 2nd part NOT loaded");
    }
}
else
{
    console.log("***** Mobi 1st key not loaded *****");
}
    console.log("input length is: " + mobi.length);
 
    var nCars = 0;
    var offset = 0;
    var startKey = {};
    startKey.start = 0;
    var carTAG = "veiculo";
    var myThing = {};
    while( startKey.start != -1)
    {
        startKey = buildJSON(mobi.substring(offset), carTAG );
        if ( startKey.start != (-1))
        {
            nCars += 1;
            // [a,b] is the location in string to display
            var a = offset + startKey.start;
            var b = 0;
            if ( (mobi.length - a) < 20)
            {
                b = mobi.length - a;
            }
            else
            {
                b = a + 20;
            }
            console.log("\tFound car at (" + startKey.start + ")");
            console.log("\tStart of data [" + mobi.substring(a,b) + "]");
            console.log("\t               0....5....0....5....0");
            offset += startKey.start + 1;
            myThing = getKeyValue(
                    mobi.substring(a),
                    carTAG,
                    0
                );
            console.log
            (   "\n***** return from getKeyValue() *****\n" +
                myThing +
                "\n***** return from getKeyValue() *****\n"
            );
            var myObject = JSON.parse(myThing);
            var str = JSON.stringify( myObject );
            console.log
            (
                "parsed: " +
                str
            );
            console.log( "Cod: " + myObject.veiculo.codveic );
            console.log( "Lat " + myObject.veiculo.latitude );
            console.log( "Long " + myObject.veiculo.longitude );
       }
    }   // end while()
    console.log("Found " + nCars + " cars");
    startKey.start = -1;    // forced exit

    // now we go for the values...
    if(startKey.start < 0)
    {
        console.log("No root found on XML string. Aborting");
        return;
    }
    var level = 0;  // this is to get the correct indentation
    var myThing = getKeyValue(
        mobi.substring(startKey.start),
        startKey.key,
        level
        );
    console.log
    (   "\n***** return from getKeyValue() *****\n" +
        myThing +
        "\n***** return from getKeyValue() *****\n"
    );
    if ( level < 4)  return;
    
///////////////////////////////////////////////////////////////////
app.get(
    "/",
    function(req, res)
    {
        res.render(
            "MapTest-1",
            { 
                KEY_ONE:        process.env.KEY_ONE,
                From_Mobi:      mobiData
            });
    }
    );
    
app.listen(    process.env.PORT,     process.env.IP, 
    function()
    {
       console.log("Maps test started!");
    }
    );