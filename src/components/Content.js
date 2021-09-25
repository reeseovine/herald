import React, { Component } from 'react';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

import { Frontpage } from '../layouts/Frontpage';
import { Articles } from '../layouts/Articles';

export class Content extends Component {
	constructor(){
		super();
		this.state = {
			feedType: '',
			feed: []
		};
	}

	componentDidMount(){
		let feedType = '';
		let path = window.location.pathname.split('/').splice(1);

		if (path.length == 0 || path[0] == ''){
			feedType = 'frontpage';
		} else if (path[0].length > 0){
			feedType = path[0];
		}

		fetch(`/api/feed/${path.join('/')}`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					feedType,
					feed: data
				});
			});
	}

	render(){
		if (this.state.feed.length > 0){
			switch (this.state.feedType){
				case 'frontpage':
					return ( <Frontpage feed={this.state.feed} /> );
					break;
				case 'category':
					return ( <Articles feed={this.state.feed} /> );
					break;
				case 'source':
					return ( <Articles feed={this.state.feed} /> );
					break;
				case 'article':
					return ( <Articles feed={this.state.feed} /> );
					break;
			}
		}
		return (
			<div className="text-center py-5">
				<Icon path={mdiLoading} size={2} spin={1.5} />
			</div>
		);
	}
}
