import { Component } from 'react';

import status from 'statuses';

export class Error extends Component {
	render(){
		document.title = `${this.props.code} | Herald`;
		return (
			<div className="text-muted text-center py-4">
				<h1 className="display-1">{this.props.code || '!'}</h1>
				<p className="lead">
					{this.props.message || status.message[this.props.code] || 'An unknown error occurred'}
				</p>
			</div>
		);
	}
}
