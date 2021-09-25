import React, { Component } from 'react';
import manip from '../content_manipulation';

export class Hero extends Component {
	render(){
		return (
			<div className="hero p-4 p-md-5 mb-4 text-white rounded bg-dark">
				<h1 className="article-title display-4">
					<a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a>
				</h1>
				<p className="lead">{manip.getText(this.props.entry.content, {count: 1, images: false})}</p>
				<p className="byline text-light mb-0">
					<a href={'/category/'+this.props.entry.feed.category.id}>{manip.sanitize(this.props.entry.feed.category.title)}</a> &mdash; <a href={'/source/'+this.props.entry.feed.id}>{manip.sanitize(this.props.entry.feed.title)}</a> &mdash; <a href={this.props.entry.url}>{manip.dateFmt(this.props.entry.published_at)}</a>
				</p>
			</div>
		);
	}
}
