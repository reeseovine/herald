import React, { Component } from 'react';
import manip from '../content_manipulation';

import 'highlight.js/scss/default.scss';
import hljs from 'highlight.js/lib/common.js';

import { Loader } from '../components/Loader';

export class Full extends Component {
	componentDidMount(){
		hljs.highlightAll();
	}
	render(){
		if (this.props.entry){
			return (
				<article className={`mb-5 pb-4 border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>
					<h2 className="article-title display-6"><a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a></h2>
					<p className={`byline ${this.props.isLight ? 'text-muted' : 'text-light'}`}>
						<a href={'/category/'+this.props.entry.feed.category.id}>{manip.sanitize(this.props.entry.feed.category.title)}</a> &mdash; <a href={'/source/'+this.props.entry.feed.id}>{manip.sanitize(this.props.entry.feed.title)}</a> &mdash; <a href={this.props.entry.url} target="_blank">{manip.dateFmt(this.props.entry.published_at)}</a>
					</p>

					<div className="article-body fw-light">
						{manip.getText(this.props.entry.content)}
					</div>
				</article>
			);
		} else {
			return <Loader />;
		}
	}
}
