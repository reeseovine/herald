import React, { Component } from 'react';
import manip from '../content_manipulation';

import 'highlight.js/scss/default.scss';
import hljs from 'highlight.js/lib/common.js';

export class Full extends Component {
	componentDidMount(){
		hljs.highlightAll();
	}
	render(){
		return (
			<article className="my-4">
				<h2 className="display-6">{manip.sanitize(this.props.entry.title)}</h2>
				<p><small className="fst-italic text-muted fw-light"><a href={this.props.entry.url}>{manip.sanitize(this.props.entry.feed.title)}</a> - {manip.dateFmt(this.props.entry.published_at)}</small></p>

				<div className="post-body fw-light">
					{manip.getText(this.props.entry.content)}
				</div>
			</article>
		);
	}
}
