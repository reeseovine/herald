import React, { Component } from 'react';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';

export class Hero extends Component {
	render(){
		if (this.props.entry){
			return (
				<div className={`hero p-4 p-md-5 mb-3 text-white rounded ${this.props.isLight ? 'bg-dark' : 'bg-black'}`}>
					<h1 className="article-title display-4">
						<a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a>
					</h1>
					<p className="lead fs-4">{manip.getText(this.props.entry.content, {count: 1, paras: false, parasOnly: true, images: false})}</p>
					<p className="byline mb-0 text-light">
						<a href={'/category/'+this.props.entry.feed.category.id}>{manip.sanitize(this.props.entry.feed.category.title)}</a> &mdash; <a href={'/source/'+this.props.entry.feed.id}>{manip.sanitize(this.props.entry.feed.title)}</a> &mdash; <a href={this.props.entry.url} target="_blank">{manip.dateFmt(this.props.entry.published_at, {relative: true})}</a>
					</p>
				</div>
			);
		} else {
			return (
				<div className={`hero p-4 p-md-5 mb-3 text-white rounded ${this.props.isLight ? 'bg-dark' : 'bg-black'}`}>
					<Loader />
				</div>
			);
		}
	}
}
