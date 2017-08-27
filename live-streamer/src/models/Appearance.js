import Attempt from './Attempt';

const liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];		

class Appearance {
	constructor(appearanceJson, lifter) {
		this._lifter = lifter || appearanceJson._lifter;
		this.bodyweight = appearanceJson.bodyweight;
		this.place = appearanceJson.place;
		this.team = appearanceJson.team;
		this.videoId = appearanceJson.videoId;
		this.wilks = appearanceJson.wilks;
		this.total = appearanceJson.total;
		this.place = appearanceJson.place;
		this.lot = appearanceJson.lot;
		this.division = appearanceJson.division;
		this.weightClass = appearanceJson.weightClass;
		this._competition = appearanceJson._competition;
		this._id = appearanceJson._id;
		// this.total.lifterObj = this;
		this.attempts = {} // TODO: change to attempts
		for (let attemptName in appearanceJson.lifts) {
			if (appearanceJson.lifts.hasOwnProperty(attemptName)) {
				this.attempts[attemptName] = new Attempt(appearanceJson.lifts[attemptName], this, attemptName);
			}
		}
	}

	nextAttemptWithFrameData(currentAttemptName, direction=1) {
		const curAttemptIdx = liftsInOrder.indexOf(currentAttemptName);
		let i = curAttemptIdx + direction;
		while (i < liftsInOrder.length && i >= 0) {
			let nextAttempt = this.attempts[liftsInOrder[i]];
			if (nextAttempt.hasFrame()) {
				return nextAttempt;
			}
			i += direction;
		}	
		return null;
	}
	// calculates best squat, bench, deadlift, as of attempt given
	liftTotalAsOf(liftName, asOfAttempt, projected=false) {
		let bestWeight = 0;
		for (let i = 0; i < 3; i++) {
			// check if lift has happened yet
			const tempAttemptName = liftName + ' ' + (i + 1);
			const tempAttempt = this.attempts[tempAttemptName];
			const hasHappened =  tempAttempt.hasOccurredAsOf(asOfAttempt, true);
			const hasBeenSubmitted = tempAttempt.hasBeenSubmittedAsOf(asOfAttempt);
			if (hasHappened) {
				if (tempAttempt.result === 'good-lift') {
					bestWeight = +tempAttempt.weight;
				} else if (i === 2 && bestWeight === 0) {
					return 'DSQ';
				}
			} else if (projected && hasBeenSubmitted) {
				bestWeight = +tempAttempt.weight;
			}
			//todo have lifts show up as DQs during live leaderboard
		}
		return bestWeight;
	}

	totalAsOf(asOfAttempt, projected=false) {
		const lifts = ['Squat', 'Bench', 'Deadlift'];
		const bestLifts = {};
		let disqualified = false;
		let total = 0;


		lifts.forEach((lift) => {
			if (!asOfAttempt) {
				bestLifts[lift] = 0;
			} else {
				bestLifts[lift] = this.liftTotalAsOf(lift, asOfAttempt, projected);
			}
			if (bestLifts[lift] === 'DSQ') {
				disqualified = true;
				bestLifts[lift] = 0;
			}
			total += bestLifts[lift];
		});

		bestLifts['total'] = disqualified ? 'DSQ' : total;
		return bestLifts;
	}
}

export default Appearance;