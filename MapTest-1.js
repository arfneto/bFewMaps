//
//
// Map Test 1
//
//

var map;
var markers = [];	// to hold the markers

function initMap()
{

	var locations = [
		{title: 'Islas', location: 			{ lat: -23.552589, lng: -46.574953 }},
		{title: 'Sergio', location: 		{ lat: -23.492421, lng: -46.629011 }},
		{title: 'Mix Leste', location: 		{ lat: -23.541898, lng: -46.547551 }},
		{title: 'Cotia', location: 			{ lat: -23.602668, lng: -46.919469 }},
		{title: 'Aguas Claras', location: 	{ lat: -23.421393, lng: -46.621301 }},
		{title: 'Horto', location: 			{ lat: -23.459292, lng: -46.633217 }},
		{title: 'James', location: 			{ lat: -23.551656, lng: -46.619614 }},
		{title: 'Carlos', location: 		{ lat: -23.527011, lng: -46.945907 }}
	];

	map = new google.maps.Map(
		document.getElementById('map'),
		{ 
			center:
			{
			    lat: -23.552589,
				lng: -46.574953
			},
			zoom: 16
		}
	);

	var bigInfoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	// now we loop thru the location arrary and fill in the markers
	for(var ix = 0; ix < locations.length; ix++)
	{
		var pos = locations[ix].location;
		var title = locations[ix].title;
		var marker = new google.maps.Marker(
			{
				map: map,
				position: pos,
				title: title,
				animation: google.maps.Animation.DROP,
				id: ix
			}
		);

		markers.push(marker);	// one more
		bounds.extend(marker.position);	// make sure if fits in the map
		marker.addListener(
			'click',
			function()
			{
				populateInfoWindow( this, bigInfoWindow);
			}
		);	// event added
	}	 // end for ix
	// now adjust the zoom level so all locatiosn fit in
	map.fitBounds(bounds);
}	// end initMap()

//
//
// populateInfoWindow: set the appropriate content for the 
//	clicked marker
//
//
function populateInfoWindow( marker, infoWindow)
{
	if(infoWindow.marker != marker)
	{
		infoWindow.marker = marker;
		infoWindow.setContent('<div>' + marker.title + '</div>');
		infoWindow.open(map.marker);
		infoWindow.addListener(
			'closeclick',
			function()
			{
				infoWindow.setMarker(null);
			}
		);
	}
}	// end function populateInfoWindow()