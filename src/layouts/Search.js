import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { MiniCard } from '../views/MiniCard';

export class Search extends Component {
	constructor(){
		super();
		this.state = {
			results: []
		};
	}

	componentDidMount(){
		document.title = `Search for ${this.props.query} | Herald`;
		fetch(`/api/search?q=${this.props.query}`)
			.then((response) => response.json())
			.then((results) => {
				// TODO: implement infinite scroll
				this.setState({results: results.entries.slice(0,10)});
			});
	}

	render(){
		console.log(this.state.results);
		return (
			<div>
				<Row>
					<Col xs sm={{span: 10, offset: 1}} xl={{span: 8, offset: 2}} className="px-4">
						<h1 className={`fw-light mb-4 py-3 border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>{this.state.results.length} matches for "{this.props.query}".</h1>
					</Col>
				</Row>
				<div className="masonry">
					{this.state.results.map((entry, key) => {
						return <MiniCard key={key} entry={entry} isLight={this.props.isLight} />
					})}
				</div>
			</div>
		);
	}
}
