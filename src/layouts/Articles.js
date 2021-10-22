import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { withRouter } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';

import { Error } from '../components/Error';
import { Loader } from '../components/Loader';

class Articles extends Component {
	constructor(){
		super();
		this.state = {
			feed: [],
			feedName: '',
			error: false,
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
			offsetQuery = '&offset='+this.state.offset*8;
		}
		fetch(`/api/feed/${this.props.type}/${this.props.match.params.id}${offsetQuery}`)
			.then((response) => {
				if (response.status == 200){
					return response.json()
				} else {
					this.setState({error: response.status});
					return [];
				}
			}).then((feed) => {
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

				if (this.state.feedName === ''){
					let feedName = '';
					if (feed.length > 0){
						switch (this.props.type){
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
			}).catch(err => {
				console.error(err);
				this.setState({error: 500});
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
			return <Error code={this.state.error} />;
		} else {
			return (
				<Row>
					<Col xs sm={{span: 10, offset: 1}} lg={{span: 8, offset: 2}} className="px-4">
						{this.state.feed.map((entry, key) => {
							return <Full key={key} entry={entry} isLight={this.props.isLight} />
						})}
					</Col>
					<Loader ref={this.loaderRef} className={this.state.endOfFeed ? 'd-none' : ''} />
					<div className={`text-center fst-italic  my-4 ${this.state.endOfFeed ? '' : 'd-none'}`}>
						You've reached the end.
					</div>
				</Row>
			);
		}
	}
}

export default withRouter(Articles);
