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
import Serializer from '../utils/serializer';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import Spinner from './Spinner';
import Appearance from '../models/Appearance';
import { capitalize } from '../utils/general';


class CompetitionRoute extends Component {
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
			leaderboardType: 'final',
			watchContinuousLifters: [],
			loading: true,
			dummyContainerHeight: 0
		};

		this.liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];
		this.edits = {};
	}


	componentDidMount = () => {
		this.updateBasedOnURL(this.props);
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillReceiveProps = (nextProps) => {
		this.updateBasedOnURL(nextProps);
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.competition !== this.state.competition ||
			prevState.division !== this.state.division || 
			prevState.weightClass !== this.state.weightClass) {
			const addToHistory = !!prevState.division && !!prevState.weightClass;
			
			this.getCompData(this.state.competition, this.state.division, this.state.weightClass);
		 	Serializer.updateUrlParams(this.props.history, this.props.location,
		 		{weightClass: this.state.weightClass, division: this.state.division}, addToHistory);
		}
	}

	componentWillUnmount() {
	  window.removeEventListener('scroll', this.handleScroll);
	}

	updateBasedOnURL = (props) => {
		const competitionName = props.match.params.competitionName;
		let activeCompetition, division, weightClass;
		const queryParams = Serializer.deserializeParams(queryString.parse(props.location.search));

		if (!this.state.competition) {
			for (let i = 0; i < props.competitions.length; i++) {
				const competition = props.competitions[i];
				if (competition.name === competitionName) {
					if (competition !== this.state.competition) {
						activeCompetition = competition;
						this.setState({competition});
					}
					break;
				}
			}
		} else {
			activeCompetition = this.state.competition;
		}

		division = queryParams.division;
		weightClass = queryParams.weightClass;

		if (activeCompetition &&
			(!weightClass || !division)) {
			division = activeCompetition.options['default'].division;
			weightClass = activeCompetition.options['default'].weightClass;
		}



		if (activeCompetition !== this.state.competition ||
			division !== this.state.division ||
			weightClass !== this.state.weightClass) {
			// this.getCompData(activeCompetition, division, weightClass)
			// this.setState({division, weightClass});
		}

		if (activeCompetition) {
			if (division !== this.state.division) this.setState({division});
			if (weightClass !== this.state.weightClass) this.setState({weightClass});
		}
		this.setState({editMode: queryParams.editMode === 'true'});
	}

	getCompData = (competition, division, weightClass) => {
		if (!competition) return false;

		//console.log('fetching data');

		const params = {
			_competition: competition._id,
			division: division,
			weightClass: weightClass
		};

		this.setState({loading: true});

		fetch('/api/appearances?' + queryString.stringify(params))
			.then(res => res.json())
			.then(json => {
				//console.log("yooo");
				//console.log(json)
				const lifterAppearances = json.map((appearanceJson) => new Appearance(appearanceJson));
				this.sortedAttemptData = this.sortAttempts(lifterAppearances);
				this.addFlightsToAttempts(this.sortedAttemptData);
				this.setState({ lifterAppearances, loading: false});
				this.receivedNewData(lifterAppearances);
			});
	}

	receivedNewData = (appearances) => {
		const urlparams = Serializer.deserializeParams(queryString.parse(this.props.location.search));
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


	handleScroll = (event) => {
		if (this.state.loading === true) return false;
		let scrollTop = document.documentElement.scrollTop; //event.srcElement.body.scrollTop;
		console.log('scrolling', scrollTop);
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


	// called every second (or so) when the youtube player checks the current time of the player
	timeChange = (time) => {
		if (this.state.editMode) return;
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
		//console.log('sorting attempt data');

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
				// //console.log('no video id for lifter');
				// //console.log(lifter);
			}
		});


		// sort based on the frames
		for (let videoId in attemptData) {
			if (attemptData.hasOwnProperty(videoId)) {
				// sort based on lights frame
				attemptData[videoId].sort((attemptA, attemptB) => {
					return attemptA.lastNameTime - attemptB.lastNameTime;
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

	nextAttempt = (numLiftsToMove, autoPlayingLifters) => {
		if (!this.state.currentVideoId) return null;
		const attemptData = this.sortedAttemptData[this.state.currentVideoId];
		if (!attemptData) return null;

		if (!autoPlayingLifters) {
			autoPlayingLifters = this.state.watchContinuousLifters;
		}

		// const currentLiftAttempt = this.state.currentLifter.attempts[this.state.currentAttemptName];
		const currentIdx = attemptData.indexOf(this.state.currentAttempt);
		const direction = numLiftsToMove >= 0 ? 1 : -1;

		if (currentIdx === -1) return null;
		
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

		if (newIdx < 0) return null;

		if (newIdx >= attemptData.length) return null;
		// 	// no more lifters
		// 	this.setState({
		// 		leaderboardType: 'final'
		// 	});
		// 	return null;
		// }

		const newLiftAttempt = attemptData[newIdx];
		return newLiftAttempt;
	}

	getAttemptAtTime = (seconds) => {
		if (!seconds) return null;
		if (!this.state.currentVideoId) return null;

		if (!this.sortedAttemptData[this.state.currentVideoId] || !this.sortedAttemptData[this.state.currentVideoId].length) {
			//console.log('no sortedAttemptData');
			return null;
		}

		seconds += 4;

		const attemptData = this.sortedAttemptData[this.state.currentVideoId];  
		for (let i = 1; i < attemptData.length; i++) {
			// debugger;
			let attempt = attemptData[i];
			if (attempt.firstNameTime > seconds) {
				if (attempt.frameWhenClickedOn() <= seconds) {
					return attempt;
				}
				return attemptData[i-1];
			}
		}

		const lastLiftAttempt = attemptData[attemptData.length-1];
		const lastFrameOfLifter = lastLiftAttempt.lightsTime ? 
			lastLiftAttempt.lightsTime + 20 :
			lastLiftAttempt.lastNameTime + 40; // TODO; this.framerate();

		if (seconds > lastFrameOfLifter) {
			this.setState({leaderboardType: 'final'});
			return null;
		}
		return lastLiftAttempt;
	}

	lifterClick = (appearance) => {
		// //console.log(lifter);
		Serializer.navigateTo(this.props.history, '/lifter/' + appearance._lifter._id);
		return false;
		const lifterIdx = this.state.watchContinuousLifters.indexOf(appearance);
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
			newWatchContinuousLifters = this.state.watchContinuousLifters.concat([appearance]);
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

	// optionClick = (optType, val) => {
	// 	this.setState({
	// 		[optType]: val
	// 	});

	// 	const timeout = 300;
	// 	window.clearTimeout(this.optionCloseTimeout);
	// 	this.optionCloseTimeout = window.setTimeout(this.closeOptions, timeout);
	// }

	optionChange = (optType, val) => {
		

		this.setState({
			[optType]: val
		});

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
		//console.log('selecting first lifter');

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
		if (firstAttempt == null) {
			this.setState({resetPlayer: true});
		}
		this.selectLiftAttempt({attempt: firstAttempt, boolStopVideo: false});
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

	recordEdit = (timeType, seconds) => {
		const currentLifter = this.state.currentAttempt._lifter;
		const key = currentLifter.name + '_' + this.state.weightClass + '_' + this.state.division;
		const attemptName = this.state.currentAttempt.attemptName;
	
		if (!this.edits.hasOwnProperty(key)) {
			this.edits[key] = {};
		}

		if (!this.edits[key].hasOwnProperty(attemptName)) {
			this.edits[key][attemptName] = {};
		}

		this.edits[key][attemptName][timeType] = +(seconds).toFixed(0);
		if (timeType === 'firstNameTime' && !this.edits[key][attemptName]['lastNameTime']) {
			this.edits[key][attemptName]['lastNameTime'] = +(seconds).toFixed(0);
		}

		//console.log(JSON.stringify(this.edits));
	}



	//////////////////////////////////////////
	// Shared between competition route and lifter route
	//////////////////////////////////////////

	updateCurrentAttempt = (attempt) => {
		this.setState({
			currentAttempt: attempt,
			currentVideoId: attempt ? attempt._appearance.videoId : this.state.currentVideoId
		});

		// const { history, location } = this.props;

		// if (attempt) {
		// 	Serializer.updateUrlParams(history, location, {'lifter': attempt._lifter.name ? attempt._lifter.name : '', 'attempt': attempt.attemptName || ''}, false);
		// } else {
		// 	Serializer.updateUrlParams(history, location, {'lifter': null, 'attempt': null}, null);
		// }
 	}

	selectLiftAttempt = ({attempt, watchContinuous, boolStopVideo=false}) => {
		
		if (!attempt) {
			this.updateCurrentAttempt(attempt);
			return false;
		}
		
		if (!attempt.hasFrame() && !this.state.editMode) return false;

		this.setState({
			attemptToBeSelected: attempt,
			resetPlayer: false,
			boolStopVideo: boolStopVideo
		});
		this.updateCurrentAttempt(attempt);

	}


	incrementLiftersLift = (numLiftsToMove, lifterAppearance, currentAttemptName) => {
		lifterAppearance = lifterAppearance || this.state.currentAttempt._appearance;
		currentAttemptName = currentAttemptName || this.state.currentAttempt.attemptName;

		const newAttemptName = this.nextLiftAttemptName(currentAttemptName, numLiftsToMove);
		const newAttempt = lifterAppearance.attempts[newAttemptName];
		this.selectLiftAttempt({attempt: newAttempt});
	}

	incrementLifter = (numLiftsToMove, watchContinuousLifters) => {
		this.selectLiftAttempt(numLiftsToMove, watchContinuousLifters);
	}


	advanceBySeconds = (seconds=5) => {
		this.setState({
			secondsToAdvance: seconds
		});
	}

	playerUpdated = () =>{
		this.setState({
			attemptToBeSelected: null,
			secondsToAdvance: null,
			boolStopVideo: false
		});
	}

	starCurrentAttempt = () => {
		//console.log('in starCurrentAttempt');
		this.props.starAttempt(this.state.currentAttempt);
		this.setState({currentAttempt: this.state.currentAttempt});
	}

	render() {
		// if (this.state.loading === true) {
		// 	return <Spinner />
		// }
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
					optionChange={this.optionChange}
				/>
		
				{this.state.loading === false ?
			  		<div>
					<div className='dummyContainer' ref='dummyContainer' style={{height: this.state.dummyContainerHeight}}>
					</div>
					<div className='pinOnScroll' ref='pinOnScroll'>
				    	
						<CurrentLifterInfo 
				    		currentAttempt={this.state.currentAttempt}
				    		selectLiftAttempt={this.selectLiftAttempt} 
				    		activeDivision={this.state.division}
				    		activeWeightClass={this.state.weightClass}
				    		weightClassSuffix={weightClassSuffix}
				    		starAttempt={this.starCurrentAttempt}
				    		starredAttempts={this.props.starredAttempts}
				    		lifterRoute={false}
				    	/>
					    <PlayerControls 
					    	className='dark-text'
							currentAttempt={this.state.currentAttempt}
				    		sortedAttemptData={this.state.sortedAttemptData}
				    		selectLiftAttempt={this.selectLiftAttempt}
							incrementLiftersLift={this.incrementLiftersLift}
							nextAttempt={this.nextAttempt(1)}
							previousAttempt={this.nextAttempt(-1)}
							advanceBySeconds={this.advanceBySeconds}
							editMode={this.state.editMode}
							>
							<YoutubePlayer
								attemptToBeSelected={this.state.attemptToBeSelected}
								secondsToAdvance={this.state.secondsToAdvance}
								boolStopVideo={this.state.boolStopVideo}
								playerUpdated={this.playerUpdated}
								recordTime={this.timeChange}
								boolStopVideo={this.state.boolStopVideo}
								editMode={this.state.editMode}
								showMessage={!this.state.loading}
								recordEdit={this.recordEdit}
								resetPlayer={this.state.resetPlayer}
							/>
					    </PlayerControls>
					</div>
					<div ref='continueToScroll'>
				     	<Leaderboard 
				     		loading={this.state.loading}
				     		player={this.player}
				     		liftsInOrder={this.liftsInOrder}
				     		leaderboardType={this.state.leaderboardType}
				     		results={this.state.lifterAppearances}
				     		tdClick={this.selectLiftAttempt}
				     		lifterClick={this.lifterClick}
				     		optionClick={this.optionChange}
				     		currentAttempt={this.state.currentAttempt}
				     		autoPlayingLifters={this.state.watchContinuousLifters}
				     		clearAutoPlayingLifters={this.clearAutoPlayingLifters}
				     		autoPlayTopLifters={this.autoPlayTopLifters}
				     		division={this.state.division}
				 		/>
				 	</div>
				 	</div>
				:
				 	<Spinner />
				}
			</div>
	    );
	}
}

export default CompetitionRoute;

  // <Sidebar close={this.closeOptions} isOpen={this.state.optionsShown} style='right'>
		// 	    	<div className='options-pane'>
		// 				<OptionsContainer 
		// 		        	activeOpts={ 
		// 		        		{
		// 		        			weightClass: this.state.weightClass,
		// 		        			division: this.state.division,
		// 		        			leaderboardType: this.state.leaderboardType
		// 					    }
		// 					}
		// 					weightClasses={this.state.competition ? this.state.competition.options.weightClasses : null}
		// 					divisions={this.state.competition ? this.state.competition.options.divisions : null}
		// 					weightClassAlign={this.state.competition ? this.state.competition.options.weightClassAlign : null}
		// 		        	optionClick={this.optionClick}
		// 		        />
		// 		    </div>
		// 		</Sidebar>