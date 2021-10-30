import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import manip from '../content_manipulation';

import { Byline } from './Byline';

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
				manip.markAsRead(this.props.entry.id, true);
			}
		}
	}

	componentDidMount(){
		document.addEventListener('scroll', this.scrollSpy);
	}

	componentWillUnmount(){
		document.removeEventListener('scroll', this.scrollSpy);
	}

	render(){
		return (
			<article ref={this.ref} className={`mb-5 pb-4 border-bottom ${this.props.isLight ? '' : 'border-secondary'}`}>
				<h2 className="article-title display-6"><Link to={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</Link></h2>
				<Byline className="mb-3" entry={this.props.entry} read={this.state.read} isLight={this.props.isLight} />

				<div className="article-body fw-light">
					{manip.getText(this.props.entry.content)}
				</div>
			</article>
		);
	}
}
