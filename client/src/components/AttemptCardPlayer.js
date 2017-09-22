import React, { Component } from 'react';
import YoutubePlayer from './YoutubePlayer';

class AttemptCardPlayer extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.attempt !== nextProps.attempt || 
			this.props.isActive !== nextProps.isActive;
	}

	render() {
		const { 
			attempt,
			isActive,
			playerUpdated,
		} = this.props;

		return (
			<div className='player-container'>
				{isActive &&
				    <YoutubePlayer 
				    	attemptToBeSelected={attempt}
				    	muteVideo={true}
						secondsToAdvance={0}
						playerUpdated={playerUpdated}
						framerate={30}
						showMessage={false}
						/>
				}
			</div>
		);
	}
}

export default AttemptCardPlayer;