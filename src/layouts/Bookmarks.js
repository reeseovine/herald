import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { MiniCard } from '../views/MiniCard';

export class Bookmarks extends Component {
	constructor(){
		super();
		this.state = {
			feed: []
		};
	}

	componentDidMount(){
		document.title = `Bookmarks | Herald`;
		fetch(`/api/feed/bookmarks`)
			.then((response) => response.json())
			.then((feed) => {
				this.setState({feed});
			});
	}

	render(){
		return (
			<div className="masonry">
				{this.state.feed.map((entry, key) => {
					return <MiniCard key={key} entry={entry} isLight={this.props.isLight} />;
				})}
			</div>
		);
	}
}
