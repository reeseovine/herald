import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

export class Lightbox extends Component {
	constructor(){
		super();
		this.state = {
			open: false,
			content: <img src="https://placekitten.com/1920/1080" alt="meow!" />
		};
		this.rootRef = React.createRef();
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}

	open(e){
		if (e.target.tagName === 'IMG'){
			e.preventDefault();
			this.setState({
				open: true,
				content: ReactHtmlParser(e.target.outerHTML)
			});
		}
	}

	close(e){
		if (e){
			if ((e.type == 'keydown' && e.key != 'Escape') ||
			    (e.type == 'click' && e.target != this.rootRef.current)){
				return;
			}
			e.stopPropagation();
		}
		this.setState({open: false});
	}

	componentDidMount(){
		document.addEventListener('click', this.open);
		this.rootRef.current.addEventListener('click', this.close);
		document.addEventListener('keydown', this.close);
	}

	componentWillUnmount(){
		document.removeEventListener('click', this.open);
		this.rootRef.current.removeEventListener('click', this.close);
		document.removeEventListener('keydown', this.close);
	}

	render(){
		return (
			<div ref={this.rootRef} className={`lightbox-root  ${this.state.open ? 'visible' : ''}`}>
				{this.state.content}
			</div>
		);
	}
}
