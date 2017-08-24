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

export default {
	updateCurrentAttempt,
	selectLiftAttempt,
	incrementLiftersLift,
	advanceBySeconds,
	deserializeParams,
	serializeParams,
	updateUrlParams,
	framerate,
	frameFromSeconds,
	playerUpdated
};