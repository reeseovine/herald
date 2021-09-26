import React, { Component } from 'react';
import { Row, Col, Navbar, Nav, Button } from 'react-bootstrap';

import Icon from '@mdi/react';
import { mdiRefresh, mdiMagnify } from '@mdi/js';

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

	render(){
		return (
			<header className="mb-3">
				<Row className="p-2 p-md-3 align-items-baseline text-center">
					<Col xs={12} sm={6} md="auto" className="my-1 my-md-0 order-2 order-md-1">{this.state.weather.city} &mdash; {this.state.weather.condition}, {this.state.weather.temp}°</Col>
					<Col xs={12} md className="my-2 my-md-0 order-1 order-md-2">
						<a href="/" className="text-body text-decoration-none">
							<h2 className="fw-light m-0">{this.state.paperName}</h2>
						</a>
					</Col>
					<Col xs={12} sm={6} md="auto" className="my-1 my-md-0 order-3 align-self-center">
						<Icon path={mdiRefresh} size={1} role="button" title="Refresh" className="me-4" />
						<Icon path={mdiMagnify} size={1} role="button" title="Search" />
					</Col>
				</Row>
				<Navbar className="border-top border-bottom">
					<Nav className="w-100 justify-content-around text-capitalize flex-wrap">
						{ this.state.categories.map((cat) => {
							return <Nav.Link key={cat.id} href={'/category/'+cat.id} className="mx-1 mx-lg-0">{cat.title}</Nav.Link>
						}) }
					</Nav>
				</Navbar>
			</header>
		);
	}
}
