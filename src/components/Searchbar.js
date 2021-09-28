import React, { Component } from 'react';

import { Form } from 'react-bootstrap';

export class Searchbar extends Component {
	constructor(){
		super();
		this.state = {
			shown: false
		};
		this.input = React.createRef();
	}

	componentDidMount(){
		if (typeof this.props.shown === 'boolean'){
			this.setState({
				shown: this.props.shown
			});
		}
	}

	show(state){
		if (typeof state === 'boolean'){
			this.setState({
				shown: state
			});
			if (state){
				setTimeout(() => {this.input.current.focus()}, 10);
			}
		}
	}
	toggle(){ this.show(!this.state.shown); }

	render(){
		return (
			<Form
				method="get" action="/search"
				className={`${this.props.className} ${this.state.shown ? 'd-block' : 'd-none'}`}>
				<Form.Control
					ref={this.input}
					type="text" name="q" size="sm" placeholder="Search articles"
					className={this.props.isLight ? '' : 'bg-dark text-light border-secondary'} />
			</Form>
		);
	}
}
