// import React, { Component } from 'react';

// class PlayerController extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			attemptToBeSelected: null,
// 			secondsToAdvance: null
// 		}
// 	}

// 	attemptToBeSelected,
// 	boolStopVideo,
// 	playerUpdated,
// 	timeChange,
// 	currentAttempt,

// 	render() {
// 		return (
// 			<div>
// 				<div className='youtube-pane'>
// 			        <YoutubePlayer
// 			        	attemptToBeSelected={this.state.attemptToBeSelected}
// 			        	secondsToAdvance={this.state.secondsToAdvance}
// 			        	boolStopVideo={this.state.boolStopVideo}
// 			        	playerUpdated={this.playerUpdated}
// 			        	recordTime={this.timeChange}
// 			        	framerate={this.framerate()}

// 			        />
// 			    </div>
// 			    <PlayerControls 
// 					currentAttempt={this.state.currentAttempt}
// 					advanceBySeconds={advanceBySeconds}
// 					incrementLifter={this.incrementLifter}
// 				/>
// 			</div>
// 		)
// 	}
// }