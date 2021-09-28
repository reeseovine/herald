import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/scss/bootstrap.scss';

import { Header } from './components/Header';
import { Content } from './components/Content';
import './overrides.scss';

import Cookies from 'js-cookie';

export class App extends Component {
	constructor(){
		super();
		let lightCookie = Cookies.get('isLight');
		lightCookie = (typeof lightCookie === 'undefined') ? true : (lightCookie === 'true');
		this.state = {
			isLight: lightCookie
		};
		this.lightswitch = this.lightswitch.bind(this);
	}

	lightswitch(){
		Cookies.set('isLight', !this.state.isLight, {expires: 365});
		this.setState({isLight: !this.state.isLight});
	}

	render(){
		return (
			<div className={`min-vh-100 ${this.state.isLight ? 'bg-body text-body' : 'bg-dark text-light'}`}>
				<Container fluid="lg">
					<Header isLight={this.state.isLight} lightswitch={this.lightswitch} />
					<Content isLight={this.state.isLight} />
				</Container>
			</div>
		);
	}
}
