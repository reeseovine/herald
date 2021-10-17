import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';
import { Sidebar } from './Sidebar';

import { Error } from '../components/Error';
import { Loader } from '../components/Loader';

export class Article extends Component {
	constructor(){
		super();
		this.state = {
			error: false
		};
	}

	componentDidMount(){
		// fetch article
		fetch(`/api/feed/${this.props.entry.feedType}/${this.props.entry.feedId}`)
			.then((response) => response.json())
			.then((feed) => {
				this.setState({
					entry: feed[0],
					category_id: feed[0].feed.category.id
				});
				document.title = `${feed[0].title} | Herald`;
			}).catch(err => {
				console.error(err);
				this.setState({error: true});
			});
	}

	render(){
		if (this.state.error) {
			return <Error code={404} />;
		} else if (this.state.entry){
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
