import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Hero } from '../views/Hero';
import { CardView } from '../views/Card';
import { Articles } from './Articles';

export class Frontpage extends Component {
	render(){
		return (
			<main>
				<Hero entry={this.props.feed[0]} />
				<Row className="mb-4">
					<Col md={6}><CardView entry={this.props.feed[1]} /></Col>
					<Col md={6}><CardView entry={this.props.feed[2]} /></Col>
				</Row>
				<Articles feed={this.props.feed.splice(3)} />
			</main>
		);
	}
}
