/* global google */


let map;
let markers = [];	// to hold the markers

let 	_cats =	[ 	
		{ id: "Car", 		show: false,	value: 3 },
		{ id: "Client", 	show: false,	value: 5 },
		{ id: "Partner", 	show: false,	value: 2 }
		];	// for managing n categories
		
let locations = 
	[
	{
	    title: 'Austin', 
	    location: 		{ lat: 30.401227, lng: -97.735601 },
	    cat: 2
	},
	{ title: 'Columbus',	location: { lat: 40.144502, lng: -82.973553 },	cat: 5 },
	{ title: 'Houston', 	location: { lat: 29.777138, lng: -95.560402 },	cat: 3 },
	{ title: 'Kansas City', location: { lat: 38.933062, lng: -94.701969 },	cat: 5},
	{ title: 'Las Vegas',	location: { lat: 36.127524, lng: -115.171500 }, cat: 5},
	{ title: 'New York', 	location: { lat: 40.756725, lng: -73.989623 },	cat: 2},
	{ title: 'Seattle',		location: { lat: 47.616837, lng: -122.201107 }, cat: 3}
	
	];

	let bigInfoWindow = null;

function initMap()
{


	map = new google.maps.Map(
		document.getElementById('map'),
		{ 
			center:	            locations[3].location, // center on Kansas City Office
			streetViewControl:  false,
			scaleControl:       true,
			zoom:               10
		}
	);

	let bounds = new google.maps.LatLngBounds();
	bigInfoWindow = new google.maps.InfoWindow();
	
	// now we loop thru the location arrary and fill in the markers
	for(var ix = 0; ix < locations.length; ix++)
	{
		let pos = locations[ix].location;
		let title = locations[ix].title;
		let theIcon = "";
		let pinIcon = null;
	    let marker = null;
		
		switch(locations[ix].cat)
		{
			case _cats[0].value:
				// a car
				theIcon = "https://maps.google.com/mapfiles/kml/pal4/icon62.png";
		    	pinIcon = new google.maps.MarkerImage
		    		(
				        theIcon,
				        null,
				        null,
				        null,
				        new google.maps.Size(30, 40)
				     );
				marker = new google.maps.Marker(
					{
						map: map,
						position: pos,
						title: title,
						animation: google.maps.Animation.DROP,
						icon: pinIcon,
						id: ix
					});
				break;
				
			case _cats[1].value:
				// a Client
				theIcon = "http://maps.google.com/mapfiles/kml/shapes/flag.png";
		    	pinIcon = new google.maps.MarkerImage
		    		(
				        theIcon,
				        null,
				        null,
				        null,
				        new google.maps.Size(30, 40)
				     );
				marker = new google.maps.Marker(
					{
						map: map,
						position: pos,
						title: title,
						animation: google.maps.Animation.DROP,
						icon: pinIcon,
						label: 'B',
						id: ix
					});
				break;

			default:
				// a phone
				theIcon = "http://maps.google.com/mapfiles/kml/shapes/phone.png";
		    	pinIcon = new google.maps.MarkerImage
		    		(
				        theIcon,
				        null,
				        null,
				        null,
				        new google.maps.Size(30, 40)
				     );
				marker = new google.maps.Marker(
					{
						map: map,
						position: pos,
						title: title,
						animation: google.maps.Animation.DROP,
						icon: pinIcon,
						label: 'A',
						id: ix
					});
				break;
		}
	    var oneLatLng = new google.maps.LatLng(pos);
		pushOneMarker( map, marker, title, oneLatLng, bounds );
		//markers.push( marker );
	}	 // end for ix
	// now adjust the zoom level so all locatiosn fit in
	map.fitBounds(bounds);
	for (let cat = 0; cat < _cats.length; cat++)
	{
		document.getElementById(_cats[cat].id).addEventListener(
				"click",
				showListings
			);
	}	// end for
}	//	end function initMap()







function clickTest( a, b )
{
    document.getElementById("newCenter").style.backgroundColor = "rgb(255,0,0)";
    map.setCenter( { lat: a, lng: b} );
    bigInfoWindow.close();
    //bigInfoWindow.setContent("Cleared");
}





function pushOneMarker( m, k, n, p, b )
{
    // push one marker for
        //  map m 
        //  marker k,
        //  name n 
        //  position p
        //  bounds b
        //
	b.extend( k.position);	// make sure if fits in the map
	k.addListener
	(
		'click',
		function()
		{
           bigInfoWindow.setContent(
                '<div>' + k.title + '<br>' +
                '<br>Latitude: '+ k.position.lat() +
                '<br>Longitude: '+ k.position.lng() + '<br><br></div>' +
                '<button id="zoomplus"  class="btn btn-outline-primary">+</button>' +
                '<button id="zoomminus" class="btn btn-outline-primary">-</button>' +
                '<button id="newCenter" class="btn btn-outline-primary" ' +
				' onclick="clickTest(' +
                p.lat() + ',' + p.lng() +
                ')" >Centralizar neste ponto</Button><div id="test">' + 
                '<br>___Conteúdo dinâmico!!___</div>');
			populateInfoWindow( this, bigInfoWindow);
			let el = document.getElementById("zoomplus");
			if( el != null)
			{
				el.addEventListener
				(
					'click',
					function()
					{
						console.log("+ zoom");
						return;
					}
				);
				
			}	// end if
			el = document.getElementById("zoomminus");
			if( el != null)
			{
				document.getElementById("zoomminus").addEventListener
				(
					'click',
					function()
					{
						console.log("- zoom");
						return;
					}
				);
			}	// end if
		}
	);	// event added
	markers.push( k );
    return;
}   // end function pushOneMarker()





function moreZoom()
{
	// body...
}





function showListings()	
{
	//let bounds = new google.maps.LatLngBounds();
	//
	//
	// Veiculos
	//
	//
	if( this.id == "Car")
	{
		if ( _cats[0].show )
		{
			// show all markers for "Veiculos"
			for(let i = 0; i< markers.length; i++)
			{
				if( locations[i].cat == 2)
				{
					markers[i].setMap(map);
					//bounds.extend(markers[i].position);
				}
			}
			// now corrects zoom
			//map.fitBounds(bounds);
		}
		else
		{
			// clears all markers for "Veiculos"
			for(let i = 0; i< markers.length; i++)
			{
				if( locations[i].cat == 2)
				{
					markers[i].setMap(null);
					//bounds.extend(markers[i].position);
				}
			}
			// now corrects zoom
			//map.fitBounds(bounds);
		}
		_cats[0].show = ! _cats[0].show;	// toggle
		return;
	}
	//
	//
	// Clientes
	//
	//
	if( this.id == "Client")
	{
		if ( _cats[1].show )
		{
			// show all markers for "clientes"
			for(let i = 0; i< markers.length; i++)
			{
				if( locations[i].cat == 3)
				{
					markers[i].setMap(map);
					//bounds.extend(markers[i].position);
				}
			}
			// now corrects zoom
			//map.fitBounds(bounds);
		}
		else
		{
			// clears all markers for "clientes"
			for(let i = 0; i< markers.length; i++)
			{
				if( locations[i].cat == 3)
				{
					markers[i].setMap(null);
					//bounds.extend(markers[i].position);
				}
			}
			// now corrects zoom
			//map.fitBounds(bounds);
		}
		_cats[1].show = ! _cats[1].show;	// toggle
		return;
	}
	//
	//
	// Colaboradores
	//
	//
	if( this.id == "Partner")
	{
		if ( _cats[2].show )
		{
			// show all markers for "colaboradores"
			for(let i = 0; i< markers.length; i++)
			{
				if( locations[i].cat == 5)
				{
					markers[i].setMap(map);
					//bounds.extend(markers[i].position);
				}
			}
			// now corrects zoom
			//map.fitBounds(bounds);
		}
		else
		{
			// clears all markers for "veiculos"
			for(let i = 0; i< markers.length; i++)
			{
				if( locations[i].cat == 5)
				{
					markers[i].setMap(null);
					//bounds.extend(markers[i].position);
				}
			}
			// now corrects zoom
			//map.fitBounds(bounds);
		}
		_cats[2].show = ! _cats[2].show;	// toggle
		return;
	}
	return;
}	// end function showListings()

//
//
// populateInfoWindow: set the appropriate content for the 
//	clicked marker
//
//
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow)
      {
	        // Check to make sure the infowindow is not already opened on this marker.
	        if (infowindow.marker != marker)
	        {
	          infowindow.marker = marker;
	          infowindow.setContent(
	          	'<div>' + marker.title +
	          	'</div>'
	          	);
	          infowindow.open(map, marker);
	          // Make sure the marker property is cleared if the infowindow is closed.
	          infowindow.addListener(
	          	'closeclick', 
	          	function()
	          	{
	            	infowindow.marker = null;
	          	}
	          );
	        }	// end if
	   }	// end function populateInfoWindow()
