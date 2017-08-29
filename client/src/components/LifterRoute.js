import React, { Component } from 'react';
import Lifter from '../models/Lifter';
import CompetitionHeader from './CompetitionHeader';
import YoutubePlayer from './YoutubePlayer';
import PlayerControls from './PlayerControls';
import LifterTable from './LifterTable';
import LifterHeader from './LifterHeader';
import CurrentLifterInfo from './CurrentLifterInfo';
import Serializer from '../utils/serializer';

const liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];	

class LifterRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lifter: null,
			attemptToBeSelected: null,
			secondsToAdvance: null,
			currentAttempt: null,
			currentVideoId: null,
		}
	}
	componentDidMount = () => {
		this.updateBasedOnNewProps(this.props);
		this.props.sendData({'activeCompetitionId': null});
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillReceiveProps = (nextProps) => {
		this.updateBasedOnNewProps(nextProps);
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
		fetch('/lifter/' + lifterId)
			.then(res => res.json())
			.then(json => {
				const lifter = new Lifter(json);
				this.setState({lifter});
				this.updateCurrentAttempt(null);
				// 
				this.selectFirstAttempt(lifter);
			});
	}

	selectFirstAttempt = (lifter) => {
		if (!lifter.appearances.length) {
			// this.setState({resetPlayer: true});
			return false;
		} 

		lifter.appearances.sort((a, b) => {
			return new Date(b._competition.dateForSorting) - new Date(a._competition.dateForSorting)
		})[0];

		for (let i = 0; i < lifter.appearances.length; i++) {
			for (let j = 0; j < liftsInOrder.length; j++) {
				const attempt = lifter.appearances[i].attempts[liftsInOrder[j]];
				if (attempt && attempt.hasFrame()) {
					this.selectLiftAttempt({attempt, boolStopVideo: true})
					return true;
				}
			}
		}

		// this.setState({resetPlayer: true});
		return false;
	}

	// appearances = () => {
	// 	const lifter = this.state.lifter;
	// 	if (!lifter) return null;
	// 	const appearances = [];
	// 	for (let i = 0; i < lifter.appearances.length; i++) {
	// 		const appearance = lifter.appearances[i];
	// 		console.log(appearance);
	// 		appearances.push(
	// 			<div key={i}>
	// 				<CompetitionHeader 
	// 					competition={appearance._competition}
	// 					division={appearance.division}
	// 					weightClass={appearance.weightClass}
	// 				/>
	// 			</div>
	// 		);
	// 	}
	// 	return appearances;
	// }

	attemptClick = (attempt) => {
		console.log(attempt);
		this.selectLiftAttempt({attempt})
	}

	competitionClick = (appearance) => {
		const compName = appearance._competition.name;
		const { division, weightClass } = appearance;
		const lifter = appearance._lifter.name;

		Serializer.navigateTo(this.props.history, '/comp/' + compName, {division, weightClass, lifter});
	}

	//////////////////////////////////////////
	// Shared between competition route and lifter route
	//////////////////////////////////////////

	updateCurrentAttempt = (attempt) => {
		this.setState({
			currentAttempt: attempt,
			currentVideoId: attempt ? attempt._appearance.videoId : this.state.currentVideoId
		});

		const { history, location } = this.props;

		if (attempt) {
			Serializer.updateUrlParams(history, location, {'lifter': attempt._lifter.name ? attempt._lifter.name : '', 'attempt': attempt.attemptName || ''}, false);
		} else {
			Serializer.updateUrlParams(history, location, {'lifter': null, 'attempt': null}, null);
		}
 	}

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

	framerate() {
		if (!this.state.currentAttempt) return 30;
		const appearance = this.state.currentAttempt._appearance;
		const {weightClass, division} = appearance;
		const compName = appearance._competition.name;
		// console.log(this.state.currentAttempt._appearance._competition.name);
		switch (compName) {
			// console.log(thist.)

			case 'IPF Classic Worlds 2017':
				switch (weightClass + '_' + division) {
					case '66_open':
					case '57_open':

						return 25;
					case '83_open':
						return 29.88;
					default: 
						return 30;
				}
			default:
				return 30;
		}
	}	

	frameFromSeconds(seconds) {
		return Math.floor(seconds * this.framerate());
	}

	playerUpdated = () =>{
		console.log('player updated');
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
		console.log('scrolling!');
		let scrollTop = event.srcElement.body.scrollTop;
        // let itemTranslate = Math.min(0, scrollTop/3 - 60);
        if (scrollTop >= 95) {
        	this.setState({dummyContainerHeight: this.refs.pinOnScroll.clientHeight});
        	this.refs.pinOnScroll.className = 'pinOnScroll pinned';
        	// this.refs.dummyContainer.clientHeight = this.dummyContainerHeight;
        } else {
        	this.setState({dummyContainerHeight: 0});
        	this.refs.pinOnScroll.className = 'pinOnScroll';
        }
        console.log(scrollTop);
        // console.log(this.dummyContainerHeight);
	}

	render() {
		return (
			<div>
			
			<div>
				<LifterHeader lifter={this.state.lifter} />
				<div className='dummyContainer' ref='dummyContainer' style={{height: this.state.dummyContainerHeight}}>
				</div>
				<div className='pinOnScroll' ref='pinOnScroll'>
					<CurrentLifterInfo 
						currentAttempt={this.state.currentAttempt}
						showCompetitionName={true}
						selectLiftAttempt={this.selectLiftAttempt}
					/>
 					<PlayerControls 
						currentAttempt={this.state.currentAttempt}
			    		sortedAttemptData={this.state.sortedAttemptData}
						incrementLifter={this.incrementLifter}
						advanceBySeconds={this.advanceBySeconds}
						>				        
						<YoutubePlayer
				        	attemptToBeSelected={this.state.attemptToBeSelected}
				        	secondsToAdvance={this.state.secondsToAdvance}
				        	playerUpdated={this.playerUpdated}
				        	recordTime={this.timeChange}
				        	resetPlayer={this.state.resetPlayer}
				        	framerate={this.framerate()}
				        	boolStopVideo={this.state.boolStopVideo}
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

