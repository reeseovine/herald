import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Hero } from '../views/Hero';
import { CardView } from '../views/Card';
import { Full } from '../views/Full';

export class Frontpage extends Component {
	render(){
		return (
			<main>
				<Hero entry={this.props.feed[0]} />
				<Row className="mb-4">
					<Col xs={6}><CardView entry={this.props.feed[1]} /></Col>
					<Col xs={6}><CardView entry={this.props.feed[2]} /></Col>
				</Row>
				<hr />
				<Row>
					<Col lg={8}>
						<Full entry={this.props.feed[3]} />
						<hr />
						<Full entry={this.props.feed[4]} />
						<hr />
						<Full entry={this.props.feed[5]} />
						<hr />
						<Full entry={this.props.feed[6]} />
						<hr />
						<Full entry={this.props.feed[7]} />
						<hr />
						<Full entry={this.props.feed[8]} />
						<hr />
						<Full entry={this.props.feed[9]} />
					</Col>
				</Row>
			</main>
		);
	}
}
