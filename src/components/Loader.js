import React, { Component } from 'react';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

export class Loader extends Component {
	render() {
		return (
			<div className="text-center py-5">
				<Icon path={mdiLoading} size={2} spin={1.5} />
			</div>
		);
	}
}
