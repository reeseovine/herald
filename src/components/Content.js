import React, { Component } from 'react';

import { Frontpage } from '../layouts/Frontpage';
import { Bookmarks } from '../layouts/Bookmarks';
import { Articles } from '../layouts/Articles';
import { Article } from '../layouts/Article';
import { Search } from '../layouts/Search';

import { Error } from './Error';
import { Loader } from './Loader';

export class Content extends Component {
	constructor(){
		super();
		this.state = {
			feedType: '',
			feedId: -1
		};
	}

	componentDidMount(){
		let feedType = '';
		let feedId = -1;

		let path = window.location.pathname.split('/').filter(part => part.length > 0);

		if (path.length == 0 || path[0] == ''){
			feedType = 'frontpage';
		} else if (path.length > 0){
			feedType = path[0].toLowerCase();
			feedId = path[1] || feedId;
		}
		this.setState({feedType, feedId});
	}

	render(){
		switch (this.state.feedType){
			case 'frontpage':
				return <Frontpage isLight={this.props.isLight} />;
				break;
			case 'bookmarks':
				return <Bookmarks isLight={this.props.isLight} />;
				break;
			case 'category':
				return <Articles feed={this.state} isLight={this.props.isLight} />;
				break;
			case 'source':
				return <Articles feed={this.state} isLight={this.props.isLight} />;
				break;
			case 'article':
				return <Article entry={this.state} isLight={this.props.isLight} />;
				break;
			case 'search':
				return <Search query={(new URL(window.location)).searchParams.get('q')} isLight={this.props.isLight} />;
				break;
			default:
				return <Error code={404} />;
		}
	}
}
