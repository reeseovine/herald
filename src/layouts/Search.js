import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';

export class Search extends Component {
	constructor(){
		super();
		this.state = {
			results: []
		};
	}

	componentDidMount(){
		fetch(`/api/search?q=${this.props.query}`)
			.then((response) => response.json())
			.then((results) => {
				// TODO: figure out a faster way to show all results on one page
				this.setState({results: results.entries.slice(0,10)});
			});
	}

	render(){
		console.log(this.state.results);
		return (
			<Row>
				<Col xs sm={{span: 10, offset: 1}} lg={{span: 8, offset: 2}} className="px-4">
					<h1 className={`fw-light mb-5 pt-3 pb-4 border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>{this.state.results.length} matches for "{this.props.query}".</h1>
					{this.state.results.map((entry, key) => {
						return <Full key={key} entry={entry} isLight={this.props.isLight} />
					})}
				</Col>
			</Row>
		);
	}
}
