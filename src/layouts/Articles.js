import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';

export class Articles extends Component {
	render(){
		return (
			<Row>
				<Col xs sm={{span: 10, offset: 1}} lg={{span: 8, offset: 2}}>
					{this.props.feed.map((entry, key) => {
						return <Full key={key} entry={entry} className="pb-3 mb-3" />
					})}
				</Col>
			</Row>
		);
	}
}
