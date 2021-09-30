import React, { Component } from 'react';
import manip from '../content_manipulation';

import 'highlight.js/scss/default.scss';
import hljs from 'highlight.js/lib/common.js';

import { MarkRead } from '../components/MarkRead';

export class Full extends Component {
	constructor(){
		super();
		this.state = {
			read: false
		};
		this.ref = React.createRef();
		this.scrollSpy = this.scrollSpy.bind(this);
	}

	scrollSpy(e){
		if (this.ref.current){
			let past_bottom = e.target.scrollingElement.scrollTop + e.target.scrollingElement.clientHeight > this.ref.current.offsetTop + this.ref.current.offsetHeight;
			if (past_bottom && !this.state.read){
				this.setState({read: true});
				this.markAsRead(this.props.entry.id)
			}
		}
	}

	componentDidMount(){
		hljs.highlightAll();

		document.addEventListener('scroll', this.scrollSpy);
	}

	componentWillUnmount(){
		document.removeEventListener('scroll', this.scrollSpy);
	}

	markAsRead(id){
		console.log('marking '+id+' as read');
		fetch(`/api/read/${id}`).then((res) => console.log(`server returned ${res.status}: ${res.statusText}`));
	}

	render(){
		return (
			<article ref={this.ref} className={`mb-5 pb-4 border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>
				<h2 className="article-title display-6"><a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a></h2>
				<p className={`byline ${this.props.isLight ? 'text-muted' : 'text-light'}`}>
					<a href={'/category/'+this.props.entry.feed.category.id}>{manip.sanitize(this.props.entry.feed.category.title)}</a> &mdash; <a href={'/source/'+this.props.entry.feed.id}>{manip.sanitize(this.props.entry.feed.title)}</a> &mdash; <a href={this.props.entry.url} target="_blank">{manip.dateFmt(this.props.entry.published_at)}</a>
					<MarkRead className="float-end" onClick={() => {this.markAsRead(this.props.entry.id)}} />
				</p>

				<div className="article-body fw-light">
					{manip.getText(this.props.entry.content)}
				</div>
			</article>
		);
	}
}
