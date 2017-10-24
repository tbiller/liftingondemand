import Attempt from './Attempt';
import Lifter from './Lifter';
import { title } from '../utils/general';

const liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];		

class Appearance {
	constructor(appearanceJson, lifter) {
		this._lifter = lifter || new Lifter(appearanceJson._lifter, false);
		this.bodyweight = appearanceJson.bodyweight;
		this.places = appearanceJson.places;
		this.team = appearanceJson.team;
		this.videoId = appearanceJson.videoId;
		this.wilks = appearanceJson.wilks;
		this.total = appearanceJson.total;
		this.lot = appearanceJson.lot;
		this.places = appearanceJson.places;
		this.divisions = appearanceJson.divisions;
		this.weightClass = appearanceJson.weightClass;
		this._competition = appearanceJson._competition;
		this._id = appearanceJson._id;
		this.attempts = {};

		// if (this.divisions) this.division = this.divisions[0];
		// if (this.places) this.place = this.places[0];

		if (appearanceJson.attempts) {
			for (let i = 0; i < appearanceJson.attempts.length; i++) {
				const attempt = appearanceJson.attempts[i];
				if (attempt.hasOwnProperty('attemptName')) {
					this.attempts[attempt.attemptName] = new Attempt(attempt, this);
				}
			}
		}
	}

	place(division) {
		let place = ''
		if (!division) {
			const places = this.divisions.map((division) => {
				return this.places[division];
			});
			return places.join(', ');
		} else {
			return this.places[division.toLowerCase()] || '';
		}
	}
	weightclassLong() {
		return title(this.weightClass) + ' ' + this._competition.options.weightClassSuffix;
	}

	divisionLong() {
		return title(this.divisions[0]);
	}

	division(division) {
		// return title(this.division);
		let shortDivisions = [];
		if (division) {
			shortDivisions = [division];
		} else {
			shortDivisions = this.divisions;
		}

		const longDivisions = shortDivisions.map((division) => {
			const newDiv = division.toLowerCase().replace('teen ', 'T').replace('masters ', 'M').replace('m', 'M');
			switch (newDiv) {
				case 'open':
					return 'O';
				case 'junior':
					return 'J';
				default:
					return newDiv;
			}
		});

		return longDivisions.join(', ')
		
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