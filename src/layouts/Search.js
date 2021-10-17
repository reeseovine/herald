import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Row, Col } from 'react-bootstrap';

import { MiniCard } from '../views/MiniCard';

import { Loader } from '../components/Loader';

export class Search extends Component {
	constructor(){
		super();
		this.state = {
			feed: [],
			total: null,
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
		fetch(`/api/search?q=${this.props.query}${offsetQuery}`)
			.then((response) => {
				if (response.status == 200){
					return response.json()
				} else {
					this.setState({error: true});
					return [];
				}
			}).then((feed) => {
				if (!this.state.total){
					this.setState({total: feed.total});
				}
				let endOfFeed = false;
				if (feed.length < 8){
					endOfFeed = true;
				}
				this.setState({
					feed: this.state.feed.concat(feed.entries),
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
		document.title = `Search for ${this.props.query} | Herald`;
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
		return (
			<>
				<Row>
					<Col xs sm={{span: 10, offset: 1}} xl={{span: 8, offset: 2}} className="px-4">
						<h1 className={`fw-light mb-4 py-3 border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>{this.state.total} matches for "{this.props.query}".</h1>
					</Col>
				</Row>
				<div className="masonry">
					{this.state.feed.map((entry, key) => {
						return <MiniCard key={key} entry={entry} isLight={this.props.isLight} />
					})}
				</div>
				<Loader ref={this.loaderRef} className={this.state.endOfFeed ? 'd-none' : ''} />
			</>
		);
	}
}
