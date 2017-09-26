import React, { Component } from 'react';
import YouTube from 'react-youtube';
import deepEqual from 'deep-equal';

export default class YoutubePlayer extends Component {
	constructor(props) {
		super(props);
		this.player = null;
		this.recordTimeFrequency = 2000;

		this.state = {
			playerOpts: {
				height: '360',
				width: '640',
			},
		}
	}

	shouldComponentUpdate(nextProps) {
		return !deepEqual(nextProps, this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.respondToProps(nextProps);
	}

	componentWillUnmount() {
		window.clearTimeout(this.recordCurrentTimeTimeout);
	}

	respondToProps(props) {
		//console.log('responding to props');
		//console.log(props);
		// if (this.player) {
		if (props.resetPlayer === true) {
			if (this.player) this.player.loadVideoById('');
			this.setState({'currentVideoId': null})
		}
		if (props.attemptToBeSelected || props.secondsToAdvance) {
			if (props.attemptToBeSelected) {
				this.selectLiftAttempt(props.attemptToBeSelected, props.boolStopVideo, props.muteVideo);
			}
			if (props.secondsToAdvance) {
				this.advanceBySeconds(props.secondsToAdvance, props.boolStopVideo);
			}
			//console.log('done with update');
			if (this.player) props.playerUpdated();
		}
	}

	advanceBySeconds = (seconds) => {
		if (!this.player) return false;

		this.skipToSecond(this.player.getCurrentTime() + seconds);
	}

	ensureVideoIsPlaying = (videoId, boolStopVideo, startSeconds, muteVideo) => {
		if (!this.player) { return false; }
		//console.log(this.player.getVideoUrl());
		if (videoId && videoId !== this.state.currentVideoId) {
			//console.log('changing video to ' + videoId);
			this.setState({'currentVideoId': videoId});
			this.player.loadVideoById(videoId);
		}

		if (boolStopVideo) {
			this.player.cueVideoById(videoId, startSeconds);
		} else {
			this.player.playVideo();
		}

		if (muteVideo) this.player.mute();
			
	}

	selectLiftAttempt = (attempt, boolStopVideo, muteVideo=true) => {
		window.clearTimeout(this.recordCurrentTimeTimeout);
		//console.log('yt selecting attempt!!!');
		//console.log(attempt);

		const videoId = attempt._appearance.videoId;
		const seconds = attempt.frameWhenClickedOn()
		//console.log('videoId', videoId)
		//console.log('seconds', seconds)

		if (seconds > 0) {
			this.ensureVideoIsPlaying(videoId, boolStopVideo, seconds, muteVideo);
			// debugger;
			if (!boolStopVideo) {
				this.skipTo(seconds);
			}

			return true;
		} 
		this.recordCurrentTime();
		return false;
	}

	recordCurrentTime(repeat=true, frequency=2000) {
		if (!this.props.recordTime) return false;
		window.clearTimeout(this.recordCurrentTimeTimeout);
		if (this.player) {
			const currentTime = this.player.getCurrentTime();
			if (currentTime) this.props.recordTime(currentTime);
		}

		if (repeat) {
			this.recordCurrentTimeTimeout = window.setTimeout(() => {
				this.recordCurrentTime(true, frequency)
			}, frequency);
		}
	}	

	onPlayerReady = (ev) => {
		//console.log('player ready');
		this.player = ev.target;
		// if (this.state.skipToFrameOnPlayerReady) {
		// 	//console.log('skip to frame blahblah');
		// 	this.skipToFrame(this.state.skipToFrameOnPlayerReady);
		// 	this.setState({skipToFrameOnPlayerReady: null});
		// }
		this.respondToProps(this.props);

		// this.player.stopVideo();
		// this.watchCurrentLiftAttempt(); // must be called before ensureVideoIsPlaying / selectFirstLifter is called
		// this.ensureVideoIsPlaying(null, true);
	}
	
	onPlayerStateChange = (ev) => {
		if (ev.data === 1) { // 1 = playing
			// if (this.state.initializeWatchContinousOnNextRender) {
		 //  		this.selectNextLiftWhenThisLiftIsOver(this.state.selectedLifter, this.state.selectedAttemptName);
		 //  		this.setState({
			// 		initializeWatchContinousOnNextRender: false
			// 	});

		 //  	}
		  	this.recordCurrentTime(true, this.recordTimeFrequency);
		} else {
			window.clearTimeout(this.recordCurrentTimeTimeout);
		}
    }

    onError = (ev) => {
    	//console.log('error');
    	//console.log(ev);
    }

	skipTo(seconds) {
		if (!this.player) {
			// this.setState({skipToFrameOnPlayerReady: frame});
			// //console.log('player not readyssssssssssssssss');
			return false;
		}
// 
		//console.log('seeking to frame');
		this.player.seekTo(seconds, true);
		this.player.playVideo();
		// this.player.stopVideo();
		// debugger;
	}

	skipToSecond(second) {
		if (!this.player) return false;
		this.player.seekTo(second, true);
	}

	secondsFromFrame(frame) {
		//console.log('selecting', Math.floor(frame / this.props.framerate));
		return Math.floor(frame / this.props.framerate);
	}


	render = () => {
		//console.log('in ytplayer render');
		//console.log(this.props.resetPlayer);
		// if (this.props.resetPlayer) { return null; }
		return (
				<div className='youtube-pane'>
				{this.props.editMode &&
						<div className='editTools'>
			    			<div className='button' onClick={()=>this.props.recordEdit('firstNameTime', this.player.getCurrentTime())}>
			    				firstNameFrame
			    			</div>
			    			<div className='button' onClick={()=>this.props.recordEdit('lastNameTime', this.player.getCurrentTime())}>
			    				lastNameFrame
			    			</div>
			    			<div className='button' onClick={()=>this.props.recordEdit('lightsTime', this.player.getCurrentTime())}>
			    				lightsFrame
			    			</div>
			    		</div>
			    	}
			    	{(!this.state.currentVideoId && (this.props.showMessage !== false)) &&
			    		<div className='no-data overlay'>No video data found</div>
			    	}
					<YouTube
						className='youtube-player'
						opts={this.state.playerOpts}
						onReady={this.onPlayerReady}
						onStateChange={this.onPlayerStateChange}
						onError={this.onError}
					/>
					
			    </div>
		);
	}
}