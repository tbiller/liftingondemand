import React, { Component } from 'react';
import Lifter from '../models/Lifter';
// import Appearance from '../models/Appearance';
import CompetitionHeader from './CompetitionHeader';
import YoutubePlayer from './YoutubePlayer';
import PlayerControls from './PlayerControls';
// import queryString from 'query-string';

class LifterRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lifter: null
		}
	}
	componentDidMount = () => {
		this.updateBasedOnNewProps(this.props);
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

	updateBasedOnNewProps = (props) => {
		const lifterId = props.match.params.lifterId;
		this.getLifter(lifterId);
	}

	getLifter = (lifterId) => {
		fetch('/lifter/' + lifterId)
			.then(res => res.json())
			.then(json => {
				const lifter = new Lifter(json);
				this.setState({lifter});
				// this.receivedNewData(lifterAppearances);
			});
	}

	appearances = () => {
		const lifter = this.state.lifter;
		if (!lifter) return null;
		const appearances = [];
		for (let i = 0; i < lifter.appearances.length; i++) {
			const appearance = lifter.appearances[i];
			console.log(appearance);
			appearances.push(
				<div key={i}>
					<CompetitionHeader 
						competition={appearance._competition}
						division={appearance.division}
						weightClass={appearance.weightClass}
					/>
				</div>
			);
		}
		return appearances;
	}

	render() {
		return (
			<div>

				<div className='lifter-header'>
					<div className='lifter-name'>
						{ this.state.lifter ? this.state.lifter.name : '' }
					</div>
				</div>
				<div className='youtube-pane'>
			        <YoutubePlayer
			        	attemptToBeSelected={this.state.attemptToBeSelected}
			        	secondsToAdvance={this.state.secondsToAdvance}
			        	boolStopVideo={this.state.boolStopVideo}
			        	playerUpdated={this.playerUpdated}
			        	recordTime={this.timeChange}
			        	framerate={this.framerate()}
			        />
			    </div>
			    <PlayerControls 
					currentAttempt={this.state.currentAttempt}
		    		sortedAttemptData={this.state.sortedAttemptData}
		    		selectLiftAttempt={this.selectLiftAttempt}
					incrementLiftersLift={this.incrementLiftersLift}
					incrementLifter={this.incrementLifter}
					advanceBySeconds={this.advanceBySeconds}
				/>
			</div>
		);
	}
}

export default LifterRoute;

