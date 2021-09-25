import React, { Component } from 'react';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

import { Frontpage } from '../layouts/Frontpage';

export class Content extends Component {
	constructor(){
		super();
		this.state = {
			feedType: 'frontpage',
			feed: []
		};
	}

	componentDidMount(){
		fetch('/api/feed')
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					feed: data.entries,
				});
			});
	}

	render(){
		if (this.state.feed.length > 0){
			return ( <Frontpage feed={this.state.feed} /> );
		} else {
			return (
				<div className="text-center py-5">
					<Icon path={mdiLoading} size={2} spin={1.5} />
				</div>
			);
		}
	}
}
