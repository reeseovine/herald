import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Hero } from '../views/Hero';
import { CardView } from '../views/Card';
import { Full } from '../views/Full';
import { Sidebar } from './Sidebar';

export class Frontpage extends Component {
	constructor(){
		super();
		this.state = {
			feed: []
		};
	}

	componentDidMount(){
		fetch(`/api/feed/`)
			.then((response) => response.json())
			.then((feed) => {
				this.setState({feed});
			});
	}

	render(){
		return (
			<main>
				<Hero entry={this.state.feed[0]} />
				<Row className="mb-4">
					<Col md={6}><CardView entry={this.state.feed[1]} /></Col>
					<Col md={6}><CardView entry={this.state.feed[2]} /></Col>
				</Row>
				<Row>
					<Col xs md={{span: 10, offset: 1}} xl={{span: 8, offset: 2}} className="px-4">
						{this.state.feed.splice(3).map((entry, key) => {
							return <Full key={key} entry={entry} />
						})}
					</Col>
				</Row>
			</main>
		);
	}
}
