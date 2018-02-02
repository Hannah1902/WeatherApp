//
// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import Weather from '../weather';
import Map from '../map';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	/** a constructor with initial set states
	 * @param props the properties of the component
	 */
	constructor(props){
		super(props);
		this.setState({ display: true });
		this.setState({ rec: false });
		var weatherCondition = "";
		var lat;
		var long;
		var location;

	}
	geoFindMe = () => {
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(this.success, this.error);;
		}
	else {
		console.log("Unable to get permission");
	}
}

	success = (position) => {
		this.lat = position.coords.latitude;
		this.long = position.coords.longitude
		this.location = this.lat + "," + this.long;
		return this.location;
		}

	error = () => {
		console.log("Unable to retrieve your location");
	}

	/** Retrieves the weather condition. To be passed as props in order
	 * to provide access across the app
	 * @return weatherCondition the current weather condition
	 */
	conditionGetter = () => {
		return this.weatherCondition;
	}

	/** Sets the weather condition. To be passed as props in order
	 * to provide access across the app
	 * @param condition the current weather condition to set
	 */
	conditionSetter = (condition) => {
		this.weatherCondition = condition;
}

	/** Toggles display of map component
	 */


	visualiseMap = () => {
		if (this.state.rec == false) {
			this.setState({rec : true});
			this.setState({display : false});
		}
		else {
			this.setState({rec : false});
			this.setState({display : true});

		}
	}

	render() {
		this.geoFindMe();
		return (
			<div>
				{this.state.rec ? null : <Weather setter={this.conditionSetter} />}
                { this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.visualiseMap }/ > : null }
				{ this.state.rec ? <Map text={this.visualiseMap} getter={this.conditionGetter} location = {this.location} lat = {this.lat} long = {this.long}/> : null}
			</div>
		);
	}
}
