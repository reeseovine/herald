import { Component } from 'react';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';
import { Byline } from '../views/Byline';

export class Sidebar extends Component {
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
		if (this.props.type && this.props.id){
			fetch(`/api/feed/${this.props.type}/${this.props.id}`)
				.then((response) => response.json())
				.then((feed) => {
					this.setState({
						feed: feed.filter(entry => !this.props.exclude.includes(entry.id))
					});
				});
		}
	}

	render(){
		if (this.state.feed){
			return (
				<div className="list-group">
					<div className={`list-group-item p-3 ${this.props.isLight ? '' : 'bg-dark border-secondary text-white'}`}>
						<h3 className="mb-0 fw-light">More from this {this.props.type}</h3>
					</div>
					{this.state.feed.map((entry, key) => { return (
						<a key={key} href={'/article/'+entry.id} className={`list-group-item list-group-item-action p-3 ${this.props.isLight ? '' : 'bg-dark border-secondary text-white'}`}>
							<h5 className="mb-1 fw-light">{manip.sanitize(entry.title)}</h5>
							<p className="mb-1 fw-light">{manip.getText(entry.content, {count: 1, paras: false, parasOnly: true, images: false})}</p>
							<small>
								<Byline entry={entry} hideAuthor hideSource isLight={this.props.isLight} />
							</small>
						</a>
					)})}
				</div>
			);
		} else {
			return (
				<div className="list-group">
					<div className={`list-group-item p-3 ${this.props.isLight ? '' : 'bg-dark border-secondary text-white'}`}>
						<Loader state={{loading: true}} />
					</div>
				</div>
			);
		}
	}
}
