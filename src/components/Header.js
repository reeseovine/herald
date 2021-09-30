import React, { Component } from 'react';
import { Row, Col, Navbar, Nav, Button } from 'react-bootstrap';

import Icon from '@mdi/react';
import { mdiRefresh, mdiMagnify, mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';

import { Searchbar } from './Searchbar';

export class Header extends Component {
	constructor(){
		super();
		this.state = {
			weather: {
				city: '',
				condition: '',
				temp: ''
			},
			paperName: '',
			categories: []
		};
		this.searchbar = React.createRef();
	}

	componentDidMount(){
		fetch('/api/weather')
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					weather: data,
				});
			});
		fetch('/api/papername')
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					paperName: data,
				});
			});
		fetch('/api/categories')
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					categories: data,
				});
			});
	}

	refreshFeeds(){
		fetch('/api/refresh').then(() => { location.reload() });
	}

	render(){
		return (
			<header className="mb-3">
				<Row className="p-2 p-md-3 align-items-baseline text-center">
					<Col xs={12} sm={6} md={4} className="my-1 my-md-0 order-2 order-md-1">{this.state.weather.city} &mdash; {this.state.weather.condition}, {this.state.weather.temp}°</Col>
					<Col xs={12} md={4} className="my-2 my-md-0 order-1 order-md-2">
						<a href="/" className={`text-decoration-none ${this.props.isLight ? 'text-body' : 'text-light'}`}>
							<h2 className="fw-light m-0">{this.state.paperName}</h2>
						</a>
					</Col>
					<Col xs={12} sm={6} md={4} className="my-1 my-md-0 order-3 align-self-center d-flex align-items-center justify-content-center">
						<Icon path={mdiRefresh} title="Refresh" onClick={this.refreshFeeds} size={1} role="button" />
						<Icon
							path= {this.props.isLight ? mdiWeatherNight : mdiWeatherSunny}
							title={this.props.isLight ? 'Dark theme'    : 'Light theme'}
							onClick={this.props.lightswitch}
							size={1} role="button" className="ms-3" />
						<Icon path={mdiMagnify} title="Search" size={1} role="button" className="ms-3"
							onClick={() => {this.searchbar.current.toggle()}} />
						<Searchbar
							ref={this.searchbar} shown={false} isLight={this.props.isLight}
							className="ms-3 flex-grow-1" />
					</Col>
				</Row>
				<Navbar className={`border-top border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>
					<Nav className="w-100 justify-content-around text-capitalize flex-wrap">
						{ this.state.categories.map((cat) => {
							return <a key={cat.id}
								href={'/category/'+cat.id}
								className={`p-1 mx-1 mx-lg-0 text-decoration-none ${this.props.isLight ? 'link-secondary' : 'link-light'}`}>
									{cat.title}
								</a>
						}) }
					</Nav>
				</Navbar>
			</header>
		);
	}
}
