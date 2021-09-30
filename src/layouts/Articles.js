import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';
import { Loader } from '../components/Loader';

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
				let feedName = '';
				if (feed.length > 0){
					switch (this.props.feed.feedType){
						case 'category':
							feedName = feed[0].feed.category.title;
							break;
						case 'source':
							feedName = feed[0].feed.title;
							break;
					}
				}
				document.title = `${feedName} | Herald`;
			});
	}

	render(){
		if (this.state.feed.length > 0){
			return (
				<Row>
					<Col xs sm={{span: 10, offset: 1}} lg={{span: 8, offset: 2}} className="px-4">
						{this.state.feed.map((entry, key) => {
							return <Full key={key} entry={entry} isLight={this.props.isLight} />
						})}
					</Col>
				</Row>
			);
		} else {
			return <Loader />;
		}
	}
}
