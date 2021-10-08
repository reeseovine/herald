import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';
import { Sidebar } from './Sidebar';

import { Loader } from '../components/Loader';

export class Article extends Component {
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
		fetch(`/api/feed/${this.props.entry.feedType}/${this.props.entry.feedId}`)
			.then((response) => response.json())
			.then((feed) => {
				this.setState({
					entry: feed[0],
					category_id: feed[0].feed.category.id
				});
				document.title = `${feed[0].title} | Herald`;
			});
	}

	render(){
		if (this.state.entry){
			return (
				<Row>
					<Col xs md={8} className="px-4 pe-xxl-5">
						<Full entry={this.state.entry} isLight={this.props.isLight} />
					</Col>
					<Col xs md={4}>
						<Sidebar type="category" id={this.state.category_id} exclude={[this.state.entry.id]} isLight={this.props.isLight} />
					</Col>
				</Row>
			);
		} else {
			return <Loader />;
		}
	}
}
