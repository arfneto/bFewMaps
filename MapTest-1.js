//
//
// Map Test 1
//
//

var map;

function initMap()
{
	console.log( "ïnitMap: loading map");
	map = new google.maps.Map(
		document.getElementById('map'),
		{ 
			center:
			{
			    lat: -23.552589,
				lng: -46.574953
			},
			zoom: 13
		}
	);

	var ShoppingCenter = { lat: -23.560471,lng: -46.561292	};
	var hm2 = {	 lat: -23.568374,	lng: -46.536215	};

	var marker1 = new 
		google.maps.Marker(
		{
   		position: ShoppingCenter,
   		map:      map,
   		title:    'Shopping'
		}
		);	
		var marker2 = new 
		google.maps.Marker(
		{
   		position: hm2,
   		map:      map,
   		title:    'Henrique Morize 2'
		}
		);

	var marker1 = new 
	google.maps.Marker
	(
		{
   		position: ShoppingCenter,
   		map:      map,
   		title:    'Analia Franco'
		}
	);

	var marker2 = new 
	google.maps.Marker
	(
		{
   		position: hm2,
   		map:      map,
   		title:    'hm2'
		}
	);

	var infoWindow1 = new google.maps.InfoWindow(
			{ content: 'Shopping Center' }
		);

	var infoWindow2 = new google.maps.InfoWindow(
			{ content: 'Henrique Morize 2' }
		);
	
	marker1.addListener(
		'click',
		function()
		{
			infoWindow1.open(map,marker1);
		});

	marker2.addListener(
		'click',
		function()
		{
			infoWindow2.open(map,marker2);
		});
}	// end initMap()
