import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';

import { Hero } from '../views/Hero';
import { CardView } from '../views/Card';
import { Full } from '../views/Full';
import { Sidebar } from './Sidebar';

import { Loader } from '../components/Loader';

export class Frontpage extends Component {
	constructor(){
		super();
		this.state = {
			feed: [],
			loading: false,
			endOfFeed: false,
			prevY: 0,
			offset: 0
		};
		this.loaderRef = React.createRef();
	}

	loadFeed(){
		if (this.state.loading){ return; }
		this.setState({loading: true});
		let offsetQuery = '';
		if (this.state.feed.length > 0){
			offsetQuery = '?offset='+(this.state.offset+(this.state.offset===1 ? 3 : 0))*8;
		}
		fetch(`/api/feed${offsetQuery}`)
			.then((response) => response.json())
			.then((feed) => {
				let endOfFeed = false;
				if (feed.length < 8){
					endOfFeed = true;
				}
				this.setState({
					feed: this.state.feed.concat(feed),
					loading: false,
					endOfFeed,
					offset: this.state.offset+1
				});
			});
	}

	handleObserver(entities, observer){
		const y = entities[0].boundingClientRect.y;
		if (this.state.prevY > y){
			this.loadFeed();
		}
		this.setState({ prevY: y });
	}

	componentDidMount(){
		document.title = `Front page | Herald`;
		this.loadFeed();

		this.observer = new IntersectionObserver(
			this.handleObserver.bind(this),
			{
				root: null,
				rootMargin: "0px",
				threshold: 1.0
			}
		);
		this.observer.observe(this.loaderRef.current);
	}

	componentWillUnmount(){
		this.observer = undefined;
	}

	render(){
		return (
			<>
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
					<Loader
						state={{loading: this.state.loading, endOfFeed: this.state.endOfFeed}}
						loaderRef={this.loaderRef} isLight={this.props.isLight} />
				</Row>
			</>
		);
	}
}
