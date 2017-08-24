import React, { Component } from 'react';
// import compData from '../data/combinedData';
import ResultsTable from './ResultsTable';
import CompetitionHeader from './CompetitionHeader';
import Header from './Header';
import OptionsContainer from './OptionsContainer';
import PlayerControls from './PlayerControls';
import YoutubePlayer from './YoutubePlayer';
import CurrentLifterInfo from './CurrentLifterInfo';
import Leaderboard from './Leaderboard';
import Sidebar from './Sidebar';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import Appearance from '../models/Appearance';
import { capitalize } from '../utils/general';


// import '../styles/styles.css';

class Competition extends Component {
	constructor(props) {
		super(props);

		this.state = {
			weightClass: null,
			division: null,
			lifterAppearances: [],
			optionsShown: false,
			competition: null,
			attemptToBeSelected: null,
			secondsToAdvance: null,
			currentAttempt: null,
			currentVideoId: null,
			leaderboardType: null,
			watchContinuousLifters: [],
			loading: false
		};

		this.liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];
	}


	componentDidMount = () => {
		this.updateBasedOnNewProps(this.props);
	}

	componentWillReceiveProps = (nextProps) => {
		this.updateBasedOnNewProps(nextProps);
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.competition !== this.state.competition ||
			prevState.division !== this.state.division || 
			prevState.weightClass !== this.state.weightClass) {
			this.getCompData(this.state.competition, this.state.division, this.state.weightClass);
		 	this.updateUrlParams({weightClass: this.state.weightClass, division: this.state.division});
		}
	} 

	updateBasedOnNewProps = (props) => {
		const competitionName = props.match.params.competitionName;
		let newlyActiveCompetition;
		// let division, weightClass;

		for (let i = 0; i < props.competitions.length; i++) {
			const competition = props.competitions[i];
			if (competition.name === competitionName) {
				if (competition !== this.state.competition) {
					newlyActiveCompetition = competition;
					this.setState({competition});
					props.sendData({activeCompetitionId: competition._id});
				}
				break;
			}
		}

		if (newlyActiveCompetition && this.state.competition) {
			// new competition, reset to default 
			var { division, weightClass } = newlyActiveCompetition.options['default'];
		} else {
			// no change in competition, or new competition but no previous one (page refresh)
			var { division, weightClass } = this.deserializeParams(queryString.parse(props.location.search));
			//TODO check if these params are valid for this competition
			if (newlyActiveCompetition && (!division || !weightClass)) {
				division = newlyActiveCompetition.options.default.division;
				weightClass = newlyActiveCompetition.options.default.weightClass;
			}
		}

		if (division !== this.state.division) this.setState({division});
		if (weightClass !== this.state.weightClass) this.setState({weightClass});
	}

	getCompData = (competition, division, weightClass) => {
		if (!competition) return false;

		console.log('fetching data');

		const params = {
			_competition: competition._id,
			division: division,
			weightClass: weightClass
		};

		this.setState({loading: true});

		fetch('/appearances?' + queryString.stringify(params))
			.then(res => res.json())
			.then(json => {
				const lifterAppearances = json.map((appearanceJson) => new Appearance(appearanceJson));
				this.sortedAttemptData = this.sortAttempts(lifterAppearances);
				this.addFlightsToAttempts(this.sortedAttemptData);
				this.setState({ lifterAppearances, loading: false});
				
				this.receivedNewData(lifterAppearances);
			});
	}

	receivedNewData = (appearances) => {
		const urlparams = this.deserializeParams(queryString.parse(this.props.location.search));
		const lifterName = urlparams.lifter;
		const attemptName = urlparams.attempt || 'Squat 1';

		if (lifterName) {
			for (let i = 0; i < appearances.length; i++) {
				if (appearances[i]._lifter.name === lifterName) {
					this.selectLiftAttempt({attempt:appearances[i].attempts[attemptName]});
					break;
				}
				if (i === appearances.length - 1) {
					this.selectFirstLifter();
				}
			}
		} else {
			this.selectFirstLifter();
		}
	}

	// called every second (or so) when the youtube player checks the current time of the player
	timeChange = (time) => {
		const currentAttempt = this.getAttemptAtTime(time);

		if (currentAttempt) {
			if (currentAttempt !== this.state.currentAttempt) {
				if (this.state.watchContinuousLifters.length) { 
					this.incrementLifter(1);
				} else {
					this.updateCurrentAttempt(currentAttempt);
				}
			}
		} else {
			this.updateCurrentAttempt(null);
		}
	}

	sortAttempts = (lifterAppearances) => {
		console.log('sorting attempt data');

		// add all attempts to array based on videoID
		const attemptData = {};
		lifterAppearances.forEach((lifterAppearance) => {
			let videoId = lifterAppearance.videoId;
			if (videoId) {
				if (!attemptData.hasOwnProperty(videoId)) {
					attemptData[videoId] = [];
				}
				for (let attemptName in lifterAppearance.attempts) {
					if (lifterAppearance.attempts.hasOwnProperty(attemptName)) {
						let attempt = lifterAppearance.attempts[attemptName];
						if (attempt.hasFrame()) {
							attemptData[videoId].push(attempt);
						}
					}
				}
			} else {
				// console.log('no video id for lifter');
				// console.log(lifter);
			}
		});


		// sort based on the frames
		for (let videoId in attemptData) {
			if (attemptData.hasOwnProperty(videoId)) {
				// sort based on lights frame
				attemptData[videoId].sort((attemptA, attemptB) => {
					return attemptA.lastNameFrame - attemptB.lastNameFrame;
				});
			}
		}

		return attemptData;
	}

	addFlightsToAttempts = (sortedAttempts) => {
		for (let videoId in sortedAttempts) {
			if (sortedAttempts.hasOwnProperty(videoId)) {
				let previousLiftName = '';
				let previousAttemptNumber = 0;
				const flightLetters = 'ABCDEFGHIJKLMNOP';
				let currentFlightIdx = 0;

				let attempts = sortedAttempts[videoId];
				for (let i = 0; i < attempts.length; i++) {
					let attempt = attempts[i];
					let liftName = attempt.liftName;
					let attemptNumber = attempt.attemptNumber;

					if (previousAttemptNumber == 3 && attemptNumber == 1) {
						if (liftName === previousLiftName) {
							currentFlightIdx++;
						} else {
							// lift has changed
							currentFlightIdx = 0;
						}
					}

					if (attempt._appearance.flight) {
						if (attempt._appearance.flight !== flightLetters[currentFlightIdx]) {
							console.warn('ERROR with flights!!! ------------------ ');
						}
					}
					attempt._appearance.flight = flightLetters[currentFlightIdx];

					previousLiftName = liftName;
					previousAttemptNumber = attemptNumber;
				}
			}
		}
	}

	incrementLifter = (numLiftsToMove, autoPlayingLifters) => {
		const attemptData = this.sortedAttemptData[this.state.currentVideoId];
		if (!attemptData) {
			return false;
		}

		if (!autoPlayingLifters) {
			autoPlayingLifters = this.state.watchContinuousLifters;
		}

		// const currentLiftAttempt = this.state.currentLifter.attempts[this.state.currentAttemptName];
		const currentIdx = attemptData.indexOf(this.state.currentAttempt);
		const direction = numLiftsToMove >= 0 ? 1 : -1;

		if (currentIdx === -1) {
			return false;
		}
		
		let newIdx = currentIdx + numLiftsToMove;

		if (autoPlayingLifters.length) {
			// increment to next lifter that is in allowed lifters
			while (newIdx >= 0 && newIdx < attemptData.length) {
				if (autoPlayingLifters.indexOf(attemptData[newIdx]._appearance) !== -1) {
					break;
				}
				newIdx += direction;
			}
		}

		if (newIdx < 0) {
			newIdx = 0;
		}

		if (newIdx >= attemptData.length) {
			// no more lifters
			this.setState({
				leaderboardType: 'final'
			});
			return false;
		}

		const newLiftAttempt = attemptData[newIdx];
		this.selectLiftAttempt({attempt: newLiftAttempt});
	}

	getAttemptAtTime = (seconds) => {
		if (!seconds) return null;
		if (!this.state.currentVideoId) return null;

		console.log(this.sortedAttemptData);
		console.log(this.state.currentVideoId);
		if (!this.sortedAttemptData[this.state.currentVideoId]) {
			console.log('no sortedAttemptData');
			return null;
		}

		const attemptData = this.sortedAttemptData[this.state.currentVideoId];  
		const frame = this.frameFromSeconds(seconds + 4);
		for (let i = 1; i < attemptData.length; i++) {
			let attempt = attemptData[i];
			if (attempt.firstNameFrame > frame) {
				if (attempt.frameWhenClickedOn() <= frame) {
					return attempt;
				}
				return attemptData[i-1];
			}
		}

		const lastLiftAttempt = attemptData[attemptData.length-1];
		const lastFrameOfLifter = lastLiftAttempt.lightsFrame ? 
			lastLiftAttempt.lightsFrame + 20 * 30 :
			lastLiftAttempt.lastNameFrame + 40 * 30; // TODO; this.framerate();

		if (frame > lastFrameOfLifter) {
			return null;
		}
		return lastLiftAttempt;
	}

	lifterClick = (lifter) => {
		// return false;
		const lifterIdx = this.state.watchContinuousLifters.indexOf(lifter);
		let newWatchContinuousLifters;
		if (lifterIdx !== -1) {
			// deselect lifter
			newWatchContinuousLifters = this.state.watchContinuousLifters.slice();
			newWatchContinuousLifters.splice(lifterIdx, 1);
			this.setState({
				watchContinuousLifters: newWatchContinuousLifters,
			});
			this.incrementLifter(0, newWatchContinuousLifters);
		} else {
			newWatchContinuousLifters = this.state.watchContinuousLifters.concat([lifter]);
			if (this.state.watchContinuousLifters.indexOf(this.state.currentAttempt._appearance) === -1) {
				this.incrementLifter(0, newWatchContinuousLifters);
			}
			this.setState({
				watchContinuousLifters: newWatchContinuousLifters,
			});
		}
	}

	clearAutoPlayingLifters = () => {
		this.setState({
			watchContinuousLifters: []
		});
	}

	autoPlayTopLifters = (number=3) => {
		const autoPlayLifters = [];

		this.state.lifterAppearances.forEach((lifterAppearance) => {
			if (+lifterAppearance.place > 0 && +lifterAppearance.place <= number) {
				autoPlayLifters.push(lifterAppearance);
			}
		})

		this.setState({
			watchContinuousLifters: autoPlayLifters,
			leaderboardType: 'live',
		});
		this.incrementLifter(0, autoPlayLifters);
	}

	optionClick = (optType, val) => {
		this.setState({
			[optType]: val
		});

		if (optType !== 'leaderboardType') this.updateUrlParams({[optType]: val}, true);
		// const timeout = optType === 'weightClass' ? 2000 : 750; // give more time in case user wants to select division
		const timeout = 300;
		window.clearTimeout(this.optionCloseTimeout);
		this.optionCloseTimeout = window.setTimeout(this.closeOptions, timeout);
		// this.props.toggleMenu(false);
	}

	nextLiftAttemptName = (liftAttemptName, increment=1) => {
		const currentAttemptIndex = this.liftsInOrder.indexOf(liftAttemptName);
		let newAttemptIndex = currentAttemptIndex + increment;

		if (newAttemptIndex < 0) {
			newAttemptIndex = 0;
		}
		if (newAttemptIndex > this.liftsInOrder.length - 1) {
			newAttemptIndex = this.liftsInOrder.length - 1;
		}

		return this.liftsInOrder[newAttemptIndex];
	}


	selectFirstLifter = () => {
		console.log('selecting first lifter');
		if (!this.sortedAttemptData)  return false;

		// find first lifter in last flight
		let firstAttempt = null;
		let flight = '';
		for (let videoId in this.sortedAttemptData) {
			if (this.sortedAttemptData.hasOwnProperty(videoId)) {
				let attemptData = this.sortedAttemptData[videoId];
				if (attemptData.length) {
					if (!flight || attemptData[0]._appearance.flight > flight) {
						firstAttempt = attemptData[0];
						flight = firstAttempt._appearance.flight;
					}
				}
			}
		}
		// this.setState({currentVideoId: firstAttempt._appearance.videoId})
		this.selectLiftAttempt({attempt: firstAttempt, boolStopVideo: true});
	}

	toggleOptions = (boolOpen) => {
		let open = false;
		if (boolOpen !== undefined) {
			open = boolOpen;
		} else {
			open = !this.state.optionsShown;
		}
		this.setState({optionsShown: open});
	}

	closeOptions = () => {
		this.toggleOptions(false);
	}




	//////////////////////////////////////////
	// Shared between competition route and lifter route
	//////////////////////////////////////////

	updateCurrentAttempt = (attempt) => {
		this.setState({
			currentAttempt: attempt,
			currentVideoId: attempt ? attempt._appearance.videoId : this.state.currentVideoId
		});

		if (attempt) {
			this.updateUrlParams({'lifter': attempt._lifter.name ? attempt._lifter.name : '', 'attempt': attempt.attemptName || ''}, false);
		} else {
			this.updateUrlParams({'lifter': null, 'attempt': null}, null);
		}
 	}

	selectLiftAttempt = ({attempt, watchContinuous, boolStopVideo=false}) => {
		if (!attempt) return false;
		if (!attempt.hasFrame()) return false;

		this.setState({
			attemptToBeSelected: attempt,
			boolStopVideo: boolStopVideo
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

	deserializeParams = (params) => {
		const deserializedParams = {};
		for (let key in params) {
			let newKey = key;
			let newVal = params[key];
			switch (key) {
				case 'att':
					newKey = 'attempt';
					newVal = params[key] ? params[key].split('_').join(' ') : null;
					break;
				case 'wc':
					newKey = 'weightClass';
					break;
				case 'lifter':
					newVal = params[key] ? params[key].split('_').join(' ') : null;
					break;
				case 'div':
					newKey = 'division';
					break;
			}
			deserializedParams[newKey] = newVal;
		}
		return deserializedParams;
	}
	serializeParams = (params) => {
		const serializedParams = {};
		for (let key in params) {
			let newKey = key;
			let newVal = params[key];
			switch (key) {
				case 'attempt':
					newKey = 'att';
					newVal = params[key] ? params[key].split(' ').join('_') : null;
					break;
				case 'weightClass':
					newKey = 'wc';
					break;
				case 'lifter':
					newVal = params[key] ? params[key].split(' ').join('_') : null;
					break;
				case 'division':
					newKey = 'div';
					break;
			}
			serializedParams[newKey] = newVal;
		}
		return serializedParams;
	}
	updateUrlParams = (newParams, addToHistory=true) => {
		const serializedParams = this.serializeParams(newParams);
		const params = queryString.parse(this.props.location.search);
		const combinedParams = Object.assign({}, params, serializedParams);

		if (addToHistory) {
			this.props.history.push({search: '?' + queryString.stringify(combinedParams)});
		} else {
			this.props.history.replace({search: '?' + queryString.stringify(combinedParams)});
		}
	}


	framerate() {
		if (!competition) return 30;

		switch (this.state.competition.name) {
			case 'IPF Classic Worlds 2017':
				switch (this.state.weightClass + '_' + this.state.division) {
					case '66_open':
					case '57_open':
						return 25;
					case '83_open':
						return 29.88;
				}
				break;
			default:
				return 30;
		}
	}	

	frameFromSeconds(seconds) {
		return Math.floor(seconds * this.framerate());
	}

	playerUpdated = () =>{
		this.setState({
			attemptToBeSelected: null,
			secondsToAdvance: null,
			boolStopVideo: false
		});
	}

	render() {
		const weightClassSuffix = this.state.competition ? this.state.competition.options.weightClassSuffix : 'kg';
	    return (
			<div onClick={this.closeOptions}>
				<CompetitionHeader 
					competition={this.state.competition} 
					division={this.state.division}
					weightClass={this.state.weightClass}
					boolShowOptions={true} 
					toggleOptions={this.toggleOptions}
					optionsShown={this.state.optionsShown}
				/>
	
			    <Sidebar close={this.closeOptions} isOpen={this.state.optionsShown} style='right'>
			    	<div className='options-pane'>
						<OptionsContainer 
				        	activeOpts={ 
				        		{
				        			weightClass: this.state.weightClass,
				        			division: this.state.division,
				        			leaderboardType: this.state.leaderboardType
							    }
							}
							weightClasses={this.state.competition ? this.state.competition.options.weightClasses : null}
							divisions={this.state.competition ? this.state.competition.options.divisions : null}
							weightClassAlign={this.state.competition ? this.state.competition.options.weightClassAlign : null}
				        	optionClick={this.optionClick}
				        />
				    </div>
				</Sidebar>

		    	<CurrentLifterInfo 
		    		currentAttempt={this.state.currentAttempt}
		    		selectLiftAttempt={this.selectLiftAttempt} 
		    		activeDivision={this.state.division}
		    		activeWeightClass={this.state.weightClass}
		    		weightClassSuffix={weightClassSuffix}
		    	/>

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
		     	<Leaderboard 
		     		loading={this.state.loading}
		     		player={this.player}
		     		liftsInOrder={this.liftsInOrder}
		     		leaderboardType={this.state.leaderboardType}
		     		results={this.state.lifterAppearances}
		     		tdClick={this.selectLiftAttempt}
		     		lifterClick={this.lifterClick}
		     		optionClick={this.optionClick}
		     		currentAttempt={this.state.currentAttempt}
		     		autoPlayingLifters={this.state.watchContinuousLifters}
		     		clearAutoPlayingLifters={this.clearAutoPlayingLifters}
		     		autoPlayTopLifters={this.autoPlayTopLifters}
		 		/>
			</div>
	    );
	}
}

export default Competition;

  	// 
