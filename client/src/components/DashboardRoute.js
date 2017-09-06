import React, { Component } from 'react';
import TopAttempts from './TopAttempts';

class DashboardRoute extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<TopAttempts />
			</div>
		)
	}
}

export default DashboardRoute;