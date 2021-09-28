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
			<div>
				<Hero entry={this.state.feed[0]} isLight={this.props.isLight} />
				<Row className="mb-5">
					<Col md={6} className="mb-3 mb-md-0"><CardView entry={this.state.feed[1]} isLight={this.props.isLight} /></Col>
					<Col md={6}><CardView entry={this.state.feed[2]} isLight={this.props.isLight} /></Col>
				</Row>
				<Row>
					<Col xs md={{span: 10, offset: 1}} xl={{span: 8, offset: 2}} className="px-4">
						{this.state.feed.slice(3).map((entry, key) => {
							return <Full key={key} entry={entry} isLight={this.props.isLight} />
						})}
					</Col>
				</Row>
			</div>
		);
	}
}
