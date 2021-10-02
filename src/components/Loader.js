import React, { Component } from 'react';

import { Spinner } from 'react-bootstrap';

export class Loader extends Component {
	render() {
		return (
			<div className="text-center py-5">
				<Spinner animation="border" variant="secondary" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		);
	}
}
