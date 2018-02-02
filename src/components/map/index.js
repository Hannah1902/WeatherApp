// import preact
import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import Button from '../button';
import Iphone from '../iphone';
import style from './style2';
export default class Map extends Component {

	/** Constructor to set initial properties of component
	 */
	constructor(props){
		super(props);
		var map;
		var markers;
	}

	/** API call to retrieve map and places from Google API
	 * on success calls createMap()
	 * {@link https://developers.google.com/places/web-service/search}
	 * {@link https://developers.google.com/places/web-service/supported_types}
	 */
	getPlaces = () => {
		//Get current location from API or hardcode

		//API info: https://developers.google.com/places/web-service/search
		var radius = '5000';
		var type = this.filterRecs;
        var down = "../../assets/images/Down.png";
		//supported types here: https://developers.google.com/places/web-service/supported_types
		var api_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.props.location+'&radius='+radius+'&type='+type+'&key=AIzaSyBiXC1s3oFkNEejJIRcMIB2E3AcUUEacH4';
		$.ajax({
		 url: api_url,
		 dataType: 'json',
		 success : this.createMap,
		 error : function(req, err){ console.log('API call failed ' + err); }
        });
	}


	/** Initalizes map with parsed json from Google api with DOM listener
	 * @param parsed_json the json parsed from Google API
	 */
	createMap = (parsed_json) => {

		this.initialize(parsed_json);
		google.maps.event.addDomListener(window, 'load', this.initialize);
	}

	/** Initialization for map component.
	 * Sets variables and generates markers
	 * @param parsed_json the json parsed from Google API
	 *
	 */
	initialize = (parsed_json) => {
		if(parsed_json.status == google.maps.places.PlacesServiceStatus.OK){
			var center = new google.maps.LatLng(this.props.lat, this.props.long);
			this.map = new google.maps.Map(document.getElementById('map'), {
				center: center,
				zoom: 13
			});
			var placesList = document.getElementById('places');
            var distancesList = document.getElementById('distances');
			var place;
            var distance;
			var markers = [];
			for(var i = 0; i < parsed_json.results.length; i++){
				place = parsed_json.results[i]; //retrieve each element in parsed json
				var placeLoc = place.geometry.location; //retrieve location to set marker accordingly
				var marker = new google.maps.Marker({
					map: this.map,
					position: place.geometry.location,
					title: place.name
				});
				marker.addListener('click', this.markerClicked);
				markers[i] = marker;
				var dist = Math.round( this.markerDistance(placeLoc) * 10) / 10; //distance of attraction from location
				placesList.innerHTML += '<li>' + place.name + '</li>'; //build html list for display
                distancesList.innerHTML += '<li>' + dist +" km" + '</li>';
				console.log(place.name +" is "+ dist +" km");
			}
			this.markers = markers;
		}else {
			console.log("Invalid json");
		}
	}

	/** onClick handler for markers
	 * @param marker the map marker element
	 */
	markerClicked = (marker) => {
		for(var i=0; i< this.markers.length; i++){
			if(marker.latLng == this.markers[i].position){
				var marker = this.markers[i];
				break;
			}
		}
		var list = document.getElementById("places");
		for(var i = 0; i<list.childElementCount; i++){
			if(list.childNodes[i].innerHTML == marker.title) {
				this.activateLocation(list.childNodes[i], marker);
				break;
			}
		}
	}

	/** onClick handler for location list elements
	 * @param mouseEvent click location
	 */
	listClicked = (mouseEvent) => {
		for(var i = 0; i < this.markers.length; i++) {
			//check that target of click is an element of the list
			if(this.markers[i].title == mouseEvent.target.innerHTML) {
				this.activateLocation(mouseEvent.target, this.markers[i]);
				break;
			}
		}
	}

	/** Centers map on markers location from list
	 * @param item the clicked list item
	 * @param marker the marker as displayed on the map
	 */
	activateLocation = (item, marker) => {
		this.map.panTo(marker.getPosition());
		$(item).parent().find('li').removeClass('active');
		$(item).addClass('active');
	}

	/** calculates distance of place location from set/current location
	 * @param marker the marker of the attraction location
	 * @return d distance of place from current/set location
	 */
	markerDistance = (marker) => {
		var lat1 = this.props.lat;
		var lon1 = this.props.long;
		var lat2 = marker.lat;
		var lon2 = marker.lng;
  	var R = 6371; // Radius of the earth in km
  	var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  	var dLon = this.deg2rad(lon2-lon1);
  	var a =
    	Math.sin(dLat/2) * Math.sin(dLat/2) +
    	Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    	Math.sin(dLon/2) * Math.sin(dLon/2);
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  	var d = R * c; // Distance in km
  	return d;
	}

	/** Conversion from regrees to radians
	 * @param deg the degrees to be converted
	 */
	deg2rad = (deg) => {
	  return deg * (Math.PI/180)
	}

	filterRecs = () => {
		switch (this.props.getter()) {
			case "clear-day":
				return 'park';
			case "clear-night":
				return 'stadium';
			case "snow":
				return 'cafe';
			case "wind":
				return 'museum';
			case "fog":
				return 'gym';
			case "cloudy":
				return 'shopping_mall';
			case "partly-cloudy-day":
				return 'restaurant';
			case "partly-cloudy-night":
				return 'night_club';
			case "rain":
			case "sleet":
				return 'movie_theater';
			default:
				return 'hospital';
		}

	}

	render() {
		this.getPlaces();
		return (
			<div class={style.container}>
                <div class={style.top}>
                    <img class={style.gear} src="../../assets/images/Gear.png"/>
                    <Button class={style.button} clickFunction={ this.props.text }/ >
                </div>

                <div class={style.main}>
                    <div style="height:200px" id="map" class={style.map}></div>
                    
                    <div class={style.lists}>
                        <ul class={style.recs} id="places" onClick={this.listClicked} ></ul>
                        <ul class={style.recs2} id="distances"></ul>
                    </div>

                </div>

                <div class={style.foot}>

                </div>
            </div>
		);
	}
}
