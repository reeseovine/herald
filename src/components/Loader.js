import { Component } from 'react';

import { Spinner } from 'react-bootstrap';

export class Loader extends Component {
	render(){
		if (typeof this.props.state === 'object'){
			if (this.props.state.endOfFeed){
				return (
					<div ref={this.props.loaderRef} className={`text-center fst-italic my-4 ${this.props.isLight ? 'text-secondary' : 'text-muted'} ${this.props.className || ''}`}>
						You've reached the end.
					</div>
				);
			} else if (this.props.state.loading){
				return (
					<div ref={this.props.loaderRef} className={`text-center py-5 ${this.props.className || ''}`}>
						<Spinner animation="border" variant="secondary" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				);
			} else {
				return (
					<div ref={this.props.loaderRef} className={`text-center fst-italic my-4 text-secondary ${this.props.className || ''}`}>
						Scroll to load more...
					</div>
				);
			}
		} else {
			console.error('No state object provided to loader!');
			return null;
		}
	}
}
