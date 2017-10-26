import React, { Component } from 'react';
import AttemptCard from './AttemptCard';
import Attempt from '../models/Attempt';
import Spinner from './Spinner';
import '../styles/components/AttemptList.css';

class AttemptList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeAttempt: null
		};
		this.attemptCardEls = [];
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.attempts || !nextProps.attempts.length) return false;
		if (
				(!this.props.attempts || !this.props.attempts.length)  || 
				(nextProps.attempts[0] !== this.props.attempts[0])
			) {
			// select first attempt
			this.setState({activeAttempt: nextProps.attempts[0]});
		}
	}

	handleScroll = (event) => {
		// const windowHeight =  window.innerHeight
		// 	|| document.documentElement.clientHeight
		// 	|| document.body.clientHeight;

		// let scrollTop = event.srcElement.body.scrollTop;
  //     	for (let i = 0; i < this.attemptCardEls.length; i++) {
  //     		const {attempt, cardEl} = this.attemptCardEls[i];
  //     		const viewportOffset = cardEl.getBoundingClientRect();
		// 	const cardTop = viewportOffset.top;
		// 	const cardHeight = viewportOffset.height;
		// 	const cardMiddle = cardTop + cardHeight / 2.0;
		// 	if (cardMiddle > 30) {
		// 		if (attempt !== this.state.activeAttempt) this.setState({activeAttempt: attempt});
		// 		break;
		// 	}
  //     	}
	}


	isActive(attempt) {
		return this.state.activeAttempt ? attempt._id === this.state.activeAttempt._id : false;		
	}

	setActive(attempt) {
		//console.log('in active');
		this.setState({activeAttempt: attempt});
	}

	render() {
		//console.log('rendering attempt list')

		if (this.props.loading === true) {
			return (
				<div className='attempt-list'>
					<Spinner />
				</div>
			);
		}

		const attemptCards = [];
		this.attemptCardEls = [];

		let i = 0;
		this.props.attempts.forEach((attempt) => {
			const isStarred = this.props.starredAttempts ? this.props.starredAttempts.indexOf(attempt._id) !== -1 : false;
			attemptCards.push(
				<AttemptCard 
					cardRef={(cardEl) => {
						if(cardEl) this.attemptCardEls.push({attempt: attempt, cardEl: cardEl});
						//console.log(this.attemptCardEls);
					}}
					attempt={attempt} 
					starAttempt={this.props.starAttempt}
					isStarred={isStarred}
					key={attempt._id} 
					isActive={this.isActive(attempt)} 
					onClick={()=> this.setActive(attempt)}/>
			);
			i++;
		});

		return (
			<div className='attempt-list'>
				{attemptCards.length ?
					attemptCards
				:
					<div className='no-data'>No lifts found</div>
				}
			</div>
		);
	}	
}

export default AttemptList;