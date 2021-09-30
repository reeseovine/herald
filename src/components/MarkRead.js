import React, { Component } from 'react';

import Icon from '@mdi/react';
import { mdiClose, mdiCheck } from '@mdi/js';

export class MarkRead extends Component {
	state = {
		read: false
	}
	render(){
		return (
			<Icon
				path={this.state.read ? mdiCheck : mdiClose}
				size={1}
				role="button"
				className={`float-end ${this.state.read ? 'text-success' : ''}`}
				title={this.state.read ? 'Marked as read' : 'Mark as read'}
				onClick={(e) => {
					this.setState({read: true});
					this.props.onClick(e);
				}} />
		);
	}
}
