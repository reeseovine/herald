import { Component } from 'react';

export class Footer extends Component {
	render() {
		return (
			<footer className={`mt-3 p-3 text-center border-top ${this.props.isLight ? 'text-secondary' : 'text-light border-secondary'}`}>
				<small>
					<a className="link-info" target="_blank" href="https://github.com/katacarbix/herald">Herald</a> by <a className="link-info" target="_blank" href="https://github.com/katacarbix">katacarbix</a> is free software under <a className="link-info" target="_blank" href="https://github.com/katacarbix/herald/blob/main/LICENSE">The MIT License</a>. Powered by Miniflux, React, and Bootstrap.
				</small>
			</footer>
		);
	}
}
