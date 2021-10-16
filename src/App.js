import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import { Header } from './components/Header';
import { Content } from './components/Content';
import { Footer } from './components/Footer';

import './scss/style.scss';

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
			<div className={this.state.isLight ? 'light-theme bg-body text-body' : 'dark-theme bg-dark text-light'}>
				<Container fluid="lg" className="d-flex flex-column min-vh-100">
					<Header isLight={this.state.isLight} lightswitch={this.lightswitch} />
					<main className="flex-grow-1">
						<Content isLight={this.state.isLight} />
					</main>
					<Footer isLight={this.state.isLight} />
				</Container>
			</div>
		);
	}
}
