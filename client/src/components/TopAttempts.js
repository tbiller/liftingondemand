import React, { Component } from 'react';
import Attempt from '../models/Attempt';
class TopAttempts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topAttempts: []
		};
	}
	componentDidMount() {
		fetch('/attempts/top')
			.then(res => res.json())
			.then(attempts => {
				this.setState({topAttempts: attempts})
			});
	}

	attemptEls() {
		const els = [];
		const attempts = this.state.topAttempts;
		for (let i = 0; i < attempts.length; i++) {
			const attempt = new Attempt(attempts[i]);
			els.push(<div key={attempt._id}>{attempt._lifter.name}: {attempt.attemptName} @ {attempt._competition.name} </div>);
		}
		return els;
	}
	render() {

		return (
			<div className='topAttempts'>
				{this.attemptEls()}
			</div>
		)
	}
}

export default TopAttempts;