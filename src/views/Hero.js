import { Component } from 'react';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';
import { Byline } from './Byline';

export class Hero extends Component {
	markAsRead(id){
		console.log('marking '+id+' as read');
		fetch(`/api/read/${id}`).then((res) => console.log(`server returned ${res.status}: ${res.statusText}`));
	}
	render(){
		if (this.props.entry){
			let image = manip.getImages(this.props.entry.content, {count: 1, figures: false});
			let bg_img = '';
			if (image.length > 0){
				bg_img = image[0].props.src;
			}

			return (
				<div className={`hero p-4 p-md-5 mb-3 text-white rounded bg-dark ${this.props.isLight ? '' : 'border border-secondary'}`}
					style={{backgroundImage: `url(${bg_img})`}}>
					<h1 className="article-title display-4">
						<a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a>
					</h1>
					<p className="lead fs-4">{manip.getText(this.props.entry.content, {count: 1, paras: false, parasOnly: true, images: false})}</p>
					<Byline entry={this.props.entry} isLight={this.props.isLight} className="mb-0"
						lightTextClass="text-light" darkTextClass="text-light"
						lightLinkClass="link-light" darkLinkClass="link-light" />
				</div>
			);
		} else {
			return (
				<div className={`hero p-4 p-md-5 mb-3 text-white rounded ${this.props.isLight ? 'bg-dark' : 'bg-black'}`}>
					<Loader state={{loading: true}} />
				</div>
			);
		}
	}
}
