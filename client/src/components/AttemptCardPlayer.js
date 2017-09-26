import React, { Component } from 'react';
import PlayerControls from './PlayerControls';
import YoutubePlayer from './YoutubePlayer';


class AttemptCardPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			attemptToBeSelected: props.attempt,
			secondsToAdvance: null
		}

	}


	shouldComponentUpdate(nextProps, nextState) {
		return this.props.attempt !== nextProps.attempt || 
			this.props.isActive !== nextProps.isActive ||
			this.state.secondsToAdvance !== nextState.secondsToAdvance ||
			this.state.attemptToBeSelected !== nextState.attemptToBeSelected;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isActive && !this.props.isActive) {
			this.setState({attemptToBeSelected: this.props.attempt});
		}
	}
	
	playerUpdated = () => {
		this.setState({
			secondsToAdvance: null,
			attemptToBeSelected: null
		});
	}

	replayAttempt = () => {
		//console.log('in replay attempt')
		this.setState({
			attemptToBeSelected: this.props.attempt
		});
	}

	advanceBySeconds = (seconds=10) => {
		this.setState({
			secondsToAdvance: seconds
		});
	}

	render() {
		const { 
			isActive,
		} = this.props;

		//console.log('atttemptforwatchmore', this.props.attempt);

		return (
			<div className='player-container'>
				{isActive &&
					<PlayerControls
						showReplay={true}
						replayAttempt={this.replayAttempt}
						showWatchMore={true}
						attemptForWatchMore={this.props.attempt}
						className='dark-text'
						advanceBySeconds={this.advanceBySeconds}
					>
					    <YoutubePlayer 
					    	attemptToBeSelected={this.state.attemptToBeSelected}
					    	muteVideo={true}
							secondsToAdvance={this.state.secondsToAdvance}
							playerUpdated={this.playerUpdated}
							showMessage={false}
							/>
					</PlayerControls>
				}
			</div>
		);
	}
}

export default AttemptCardPlayer;