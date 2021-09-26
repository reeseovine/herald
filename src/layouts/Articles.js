import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';

export class Articles extends Component {
	constructor(){
		super();
		this.state = {
			feed: []
		};
	}

	componentDidMount(){
		fetch(`/api/feed/${this.props.feed.feedType}/${this.props.feed.feedId}`)
			.then((response) => response.json())
			.then((feed) => {
				this.setState({feed});
			});
	}

	render(){
		return (
			<Row>
				<Col xs sm={{span: 10, offset: 1}} lg={{span: 8, offset: 2}} className="px-4">
					{this.state.feed.map((entry, key) => {
						return <Full key={key} entry={entry} />
					})}
				</Col>
			</Row>
		);
	}
}
