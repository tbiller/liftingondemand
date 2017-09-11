import React, { Component } from 'react';
import TopAttempts from './TopAttempts';
import AttemptList from './AttemptList';


class DashboardRoute extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<AttemptList 
					starredAttempts={this.props.starredAttempts}
					starAttempt={this.props.starAttempt}/>
			</div>
		)
	}
}

export default DashboardRoute;