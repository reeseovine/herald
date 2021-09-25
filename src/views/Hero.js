import React, { Component } from 'react';
import manip from '../content_manipulation';

export class Hero extends Component {
	render(){
		return (
			<div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
				<h1 className="fst-italic display-4">
					<a className="link-light text-decoration-none" href={'#'+this.props.entry.id}>
						{manip.sanitize(this.props.entry.title)}
					</a>
				</h1>
				<p className="lead">{manip.getText(this.props.entry.content, {count: 1, images: false})}</p>
				<p className="fst-italic text-light fw-light mb-0"><a className="text-light" href={this.props.entry.url}>{manip.sanitize(this.props.entry.feed.title)}</a> - {manip.dateFmt(this.props.entry.published_at)}</p>
			</div>
		);
	}
}
