import React, { Component } from 'react';
import AttemptCard from './AttemptCard';
import Attempt from '../models/Attempt';
import '../styles/components/AttemptList.css';

class AttemptList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topAttempts: [],
			activeAttempt: null,
		};
	}

	componentDidMount() {
		fetch('/attempts/top')
			.then(res => res.json())
			.then(json => {
				const attempts = [];
				json.forEach((attemptJson) => {
					attempts.push(new Attempt(attemptJson));
				});
				this.setState({topAttempts: attempts})
			});
	}

	isActive(attempt) {
		return this.state.activeAttempt ? attempt._id === this.state.activeAttempt._id : false;		
	}

	setActive(attempt) {
		this.setState({activeAttempt: attempt});
	}

	render() {
		const attemptCards = [];
		let i 
		this.state.topAttempts.forEach((attempt) => {
			attemptCards.push(
				<AttemptCard 
					attempt={attempt} 
					starAttempt={this.props.starAttempt}
					starredAttempts={this.props.starredAttempts}
					key={attempt._id} 
					isActive={this.isActive(attempt)} 
					onClick={()=> this.setActive(attempt)}/>
			);
		});

		return (
			<div className='attempt-list'>
				{attemptCards}
			</div>
		);
	}	
}

export default AttemptList;