import React, { Component } from 'react';
import Lifter from '../models/Lifter';
import CompetitionHeader from './CompetitionHeader';
import YoutubePlayer from './YoutubePlayer';
import PlayerControls from './PlayerControls';
import LifterTable from './LifterTable';
import LifterHeader from './LifterHeader';
import Spinner from './Spinner';
import CurrentLifterInfo from './CurrentLifterInfo';
import queryString from 'query-string';
import Serializer from '../utils/serializer';
import deepEqual from 'deep-equal';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

const liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];	

class LifterRoute extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lifter: null,
			loading: true,
			attemptToBeSelected: null,
			secondsToAdvance: null,
			currentAttempt: null,
			currentVideoId: null,
			dummyContainerHeight: 0
		}
	}

	componentDidMount = () => {
		this.updateBasedOnNewProps(this.props);
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillReceiveProps = (nextProps) => {

		if (this.props.match.params.lifterId !== nextProps.match.params.lifterId) {
			this.updateBasedOnNewProps(nextProps);
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		// if (prevState.competition !== this.state.competition ||
		// 	prevState.division !== this.state.division || 
		// 	prevState.weightClass !== this.state.weightClass) {
		// 	this.getCompData(this.state.competition, this.state.division, this.state.weightClass);
		//  	this.updateUrlParams({weightClass: this.state.weightClass, division: this.state.division});
		// }
	} 
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	updateBasedOnNewProps = (props) => {
		const lifterId = props.match.params.lifterId;
		if (!this.state.lifter || this.state.lifter._id !== lifterId) {
			this.getLifter(lifterId);
		}
	}

	getLifter = (lifterId) => {
		this.setState({loading: true});
		fetch('/api/lifter/' + lifterId)
			.then(res => res.json())
			.then(json => {
				const lifter = new Lifter(json);
				//check to make sure a more recent request has not gone out in the meantime
				if (lifter._id !== this.props.match.params.lifterId) return;
				console.log('lifter', lifter);
				this.setState({lifter, loading: false});

				const urlParams = Serializer.deserializeParams(queryString.parse(this.props.location.search));
				const attemptId = urlParams.attempt;

				// debugger;
				if (attemptId) {
					// check to make sure attempt is part of lifter. If so, select it.
					lifter.appearances.forEach((appearance) => {
						for (let attemptName in appearance.attempts) {
							if (appearance.attempts.hasOwnProperty(attemptName)) {
								const attempt = appearance.attempts[attemptName];
								if (attempt._id === attemptId) {
									this.selectLiftAttempt({attempt, boolStopVideo: false});
									return;
								}
							}
						}
						this.selectFirstAttempt(lifter);
					});
				} else {
					this.selectFirstAttempt(lifter);
				}

			});
	}

	selectFirstAttempt = (lifter) => {
		if (!lifter.appearances.length) {
			return false;
		} 

		lifter.appearances.sort((a, b) => {
			return new Date(b._competition.dateForSorting) - new Date(a._competition.dateForSorting)
		})[0];

		for (let i = 0; i < lifter.appearances.length; i++) {
			for (let j = 0; j < liftsInOrder.length; j++) {
				const attempt = lifter.appearances[i].attempts[liftsInOrder[j]];
				if (attempt && attempt.hasFrame()) {
					this.selectLiftAttempt({attempt, boolStopVideo: false})
					return true;
				}
			}
		}

		return false;
	}


	attemptClick = (attempt) => {
		//console.log(attempt);
		this.selectLiftAttempt({attempt})
	}

	competitionClick = (appearance) => {
		const compName = appearance._competition.name;
		const { division, weightClass } = appearance;
		const lifter = appearance._lifter.name;

		Serializer.navigateTo(this.props.history, '/comp/' + compName, {division, weightClass, lifter});
	}

	updateCurrentAttempt = (attempt) => {
		this.setState({
			currentAttempt: attempt,
			currentVideoId: attempt ? attempt._appearance.videoId : this.state.currentVideoId
		});

		const { history, location } = this.props;

		if (attempt) {
			Serializer.updateUrlParams(history, location, {'attempt': attempt._id}, false);
		} else {
			Serializer.updateUrlParams(history, location, {'attempt': null}, null);
		}
 	}
	//////////////////////////////////////////
	// Shared between competition route and lifter route
	//////////////////////////////////////////


	selectLiftAttempt = ({attempt, watchContinuous, boolStopVideo=false}) => {
		if (!attempt) return false;
		if (!attempt.hasFrame()) return false;

		this.setState({
			attemptToBeSelected: attempt,
			boolStopVideo: boolStopVideo,
			resetPlayer: false
		})
		this.updateCurrentAttempt(attempt);
	}


	incrementLiftersLift = (numLiftsToMove, lifterAppearance, currentAttemptName) => {
		lifterAppearance = lifterAppearance || this.state.currentAttempt._appearance;
		currentAttemptName = currentAttemptName || this.state.currentAttempt.attemptName;

		const newAttemptName = this.nextLiftAttemptName(currentAttemptName, numLiftsToMove);
		const newAttempt = lifterAppearance.attempts[newAttemptName];
		this.selectLiftAttempt({attempt: newAttempt});
	}


	advanceBySeconds = (seconds=5) => {
		this.setState({
			secondsToAdvance: seconds
		});
	}


	playerUpdated = () =>{
		//console.log('player updated');
		this.setState({
			attemptToBeSelected: null,
			secondsToAdvance: null,
			boolStopVideo: false
		});
	}

	timeChange = (time) => {
		// // const currentAttempt = this.getAttemptAtTime(time);

		// if (currentAttempt) {
		// 	if (currentAttempt !== this.state.currentAttempt) {
		// 		if (this.state.watchContinuousLifters.length) { 
		// 			this.incrementLifter(1);
		// 		} else {
		// 			this.updateCurrentAttempt(currentAttempt);
		// 		}
		// 	}
		// } else {
		// 	this.updateCurrentAttempt(null);
		// }
	}

	handleScroll = (event) => {
		if (this.state.loading === true) return false;
		let scrollTop = event.srcElement.body.scrollTop;
        if (scrollTop >= 70) {
        	if (this.state.dummyContainerHeight === 0) {
	        	this.setState({dummyContainerHeight: this.refs.pinOnScroll.clientHeight});
	        	this.refs.pinOnScroll.className = 'pinOnScroll pinned';
	        }
        } else if (this.state.dummyContainerHeight > 0) {
        	this.setState({dummyContainerHeight: 0});
        	this.refs.pinOnScroll.className = 'pinOnScroll';
        }
	}

	starCurrentAttempt = () => {
		this.props.starAttempt(this.state.currentAttempt);
		this.setState({currentAttempt: this.state.currentAttempt});
	}

	render() {
		if (this.state.loading === true) {
			return <Spinner />
		}
		return (
			<div>
			
			<div>
				<LifterHeader lifter={this.state.lifter} />
				<div className='dummyContainer' ref='dummyContainer' style={{height: this.state.dummyContainerHeight}}>
				</div>
				<div className='pinOnScroll' ref='pinOnScroll'>
					<CurrentLifterInfo 
						currentAttempt={this.state.currentAttempt}
						lifterRoute={true}
						selectLiftAttempt={this.selectLiftAttempt}
						starredAttempts={this.props.starredAttempts}
						starAttempt={this.starCurrentAttempt}
					/>
 					<PlayerControls 
 						className='dark-text'
						currentAttempt={this.state.currentAttempt}
			    		sortedAttemptData={this.state.sortedAttemptData}
						incrementLifter={this.incrementLifter}
						advanceBySeconds={this.advanceBySeconds}
						selectLiftAttempt={this.selectLiftAttempt}
						>				        
						<YoutubePlayer
				        	attemptToBeSelected={this.state.attemptToBeSelected}
				        	secondsToAdvance={this.state.secondsToAdvance}
				        	playerUpdated={this.playerUpdated}
				        	recordTime={this.timeChange}
				        	resetPlayer={this.state.resetPlayer}
				        	boolStopVideo={this.state.boolStopVideo}
				        	showMessage={!this.state.loading}
				        />
				    </PlayerControls>
				   
				</div>
				<LifterTable 
					appearances={this.state.lifter ? this.state.lifter.appearances : []}
					tdClick={this.attemptClick}
					competitionClick={this.competitionClick}
					currentAttempt={this.state.currentAttempt}
				/>
			</div>
			</div>
		);
	}
}

export default LifterRoute;

