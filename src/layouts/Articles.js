import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';

import { Error } from '../components/Error';
import { Loader } from '../components/Loader';

export class Articles extends Component {
	constructor(){
		super();
		this.state = {
			feed: [],
			feedName: '',
			error: false,
			loading: false,
			prevY: 0
		};
		this.loaderRef = React.createRef();
	}

	loadFeed(){
		if (this.state.loading){ return; }
		this.setState({loading: true});
		let beforeQuery = '';
		if (this.state.feed.length > 0){
			beforeQuery = '?before='+this.state.feed[this.state.feed.length-1].id;
		}
		fetch(`/api/feed/${this.props.feed.feedType}/${this.props.feed.feedId}${beforeQuery}`)
			.then((response) => {
				if (response.status == 200){
					return response.json()
				} else {
					this.setState({error: true});
					return [];
				}
			}).then((feed) => {
				this.setState({
					feed: this.state.feed.concat(feed),
					loading: false
				});

				if (this.state.feedName === ''){
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
					this.setState({feedName});
				}
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
		this.loadFeed();

		this.observer = new IntersectionObserver(
			this.handleObserver.bind(this),
			{
				root: null,
				rootMargin: "0px",
				threshold: 1.0
			}
		);
		this.observer.observe(ReactDOM.findDOMNode(this.loaderRef.current));
	}

	componentWillUnmount(){
		this.observer = undefined;
	}

	render(){
		if (this.state.error){
			return <Error code={404} />;
		} else {
			return (
				<Row>
					<Col xs sm={{span: 10, offset: 1}} lg={{span: 8, offset: 2}} className="px-4">
						{this.state.feed.map((entry, key) => {
							return <Full key={key} entry={entry} isLight={this.props.isLight} />
						})}
					</Col>
					<Loader ref={this.loaderRef} />
				</Row>
			);
		}
	}
}
