import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Attempt from '../models/Attempt';
import TopAttemptsTable from './TopAttemptsTable';

class TopAttempts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topAttempts: []
		};
	}
	componentDidMount() {
		fetch('/api/attempts/top')
			.then(res => res.json())
			.then(json => {
				const attempts = [];
				json.forEach((attemptJson) => {
					attempts.push(new Attempt(attemptJson));
				});
				this.setState({topAttempts: attempts})
			});
	}

	// attemptEls() {
	// 	const els = [];
	// 	const attempts = this.state.topAttempts;
	// 	for (let i = 0; i < attempts.length; i++) {
	// 		const attempt = new Attempt(attempts[i]);
	// 		const params = Serializer.serializeParams({
	// 			lifter: attempt._lifter.name,
	// 			weightClass: attempt._appearance.weightClass,
	// 			division: attempt._appearance.division,
	// 			attempt: attempt.attemptName,
	// 		})
	// 		els.push(
	// 			<Link to={'/comp/' + attempt._competition.name + '?' + queryString.stringify(params)}>
	// 				<div key={attempt._id}>{attempt._lifter.name}: {attempt.attemptName} @ 
	// 					{attempt._competition.name} </div>
	// 			</Link>
	// 		);
	// 	}
	// 	return els;
	// }

	attemptClick = (attempt) => {
	 	this.props.history.push(attempt.compUrlPath());
	}

	render() {
		return (
			<div>
				<div className='title'>Starred Attempts</div>
				<TopAttemptsTable attempts={this.state.topAttempts} attemptClick={this.attemptClick} />
			</div>
		)
	}
}

export default withRouter(TopAttempts);