import React, { Component } from 'react';
import YouTube from 'react-youtube';

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
		if (this.player) this.respondToProps(props);
	}

	componentWillUpdate(nextProps) {
		this.respondToProps(nextProps);
	}

	respondToProps(props) {
		console.log('responding to props');
		if (props.attemptToBeSelected || props.secondsToAdvance) {
			if (props.attemptToBeSelected) {
				this.selectLiftAttempt(props.attemptToBeSelected, props.boolStopVideo);
			}
			if (props.secondsToAdvance) {
				this.advanceBySeconds(props.secondsToAdvance, props.boolStopVideo);
			}
			this.props.playerUpdated();
		}
	}

	advanceBySeconds = (seconds) => {
		if (!this.player) return false;

		this.skipToSecond(this.player.getCurrentTime() + seconds);
	}

	ensureVideoIsPlaying = (videoId) => {
		if (!this.player) { return false; }
		if (videoId && videoId !== this.state.currentVideoId) {
			console.log('changing video to ' + videoId);
			this.setState({'currentVideoId': videoId});
			this.player.loadVideoById(videoId);
			this.player.playVideo();
		}
	}

	selectLiftAttempt = (attempt, boolStopVideo) => {
		window.clearTimeout(this.recordCurrentTimeTimeout);
		console.log('yt selecting attempt!!!');
		console.log(attempt);
		let frame, offsetSeconds = 0;

		const videoId = attempt._appearance.videoId;

		frame = attempt.frameWhenClickedOn()

		if (!!frame) {
			this.ensureVideoIsPlaying(videoId);
			this.skipToFrame(frame, offsetSeconds);
			if (boolStopVideo === true) {
				if (this.player) this.player.stopVideo();
			} else {
				if (this.player) this.player.playVideo();
			}
			this.recordCurrentTime();
			return true;
		} 
		this.recordCurrentTime();
		return false;
	}

	recordCurrentTime(repeat=true, frequency=2000) {
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
		this.player = ev.target;
		// if (this.state.skipToFrameOnPlayerReady) {
		// 	console.log('skip to frame blahblah');
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

	skipToFrame(frame, offsetSeconds=0) {
		if (!this.player) {
			// this.setState({skipToFrameOnPlayerReady: frame});
			// console.log('player not readyssssssssssssssss');
			return false;
		}

		console.log('seeking to frame');
		this.player.seekTo(this.secondsFromFrame(frame) + offsetSeconds, true);
		this.player.playVideo();
		// this.player.stopVideo();
		// debugger;
	}

	skipToSecond(second) {
		if (!this.player) return false;
		this.player.seekTo(second, true);
	}

	secondsFromFrame(frame) {
		return Math.floor(frame / this.props.framerate);
	}


	render() {
		console.log('in ytplayer render');
		return (
				<YouTube
					className='youtube-player'
					opts={this.state.playerOpts}
					onReady={this.onPlayerReady}
					onStateChange={this.onPlayerStateChange}
				/>
		);
	}
}