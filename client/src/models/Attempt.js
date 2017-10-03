import Serializer from '../utils/serializer';
import Appearance from './Appearance';
import queryString from 'query-string';


const liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];		

class Attempt {
	constructor(attemptJson, appearance, liftsInOrder) {
		if (!appearance) appearance = new Appearance(attemptJson._appearance);
		this._id = attemptJson._id;
		this._lifter = appearance._lifter;
		this._appearance = appearance;
		this._competition = appearance._competition;
		this.firstNameTime = attemptJson.firstNameTime;
		this.lastNameTime = attemptJson.lastNameTime;
		this.endOfAttempt = attemptJson.endOfAttempt;
		this.attemptName = attemptJson.attemptName;
		this.liftName = this.attemptName.split(' ')[0];
		this.attemptNumber = this.attemptName.split(' ')[1];
		this.lightsTime = attemptJson.lightsTime;
		this.result = attemptJson.result;
		this.weight = attemptJson.weight;
		this.records = attemptJson.records;
		this.numStars = attemptJson.numStars || 0;

		if (this.lastNameTime && this.firstNameTime) {
			if (this.lastNameTime - this.firstNameTime > 120) {
				this.firstNameTime = this.lastNameTime;
			}
		}

		if (this.lightsTime && this.lightsTime < this.firstNameTime) {
			this.lightsTime = null;
			this.firstNameTime = null;
			this.lastNameTime = null;
		}

		// if (this.lightsTime && this.endOfAttempt) {
		// 	if (this.endOfAttempt > this.lightsTime + 30) {
		// 		this.endOfAttempt = this.lightsTime + 30;
		// 	}		
		// }

		if (this.lightsTime > 0) {
			if (this.endOfAttempt) {
				this.endOfAttempt = Math.min(this.endOfAttempt, this.lightsTime + 30);
			} else {
				this.endOfAttempt = this.lightsTime + 30;
			}
		} 
		if (!this.endOfAttempt) {
			if (this.lastNameTime > 0) {
				this.endOfAttempt = this.lastNameTime + 60;
			}
		}
	
	}

	attemptIdx() {
		return liftsInOrder.indexOf(this.attemptName);
	}

	liftIdx() {
		return Math.floor(this.attemptIdx() / 3);
	}

	hasFrame() {
		return !!this.firstNameTime || !!this.lastNameTime || !!this.lightsTime;
	}

	prevAttempt() {
		if (this.attemptIdx() === 0) return null;
		return this._appearance.attempts[liftsInOrder[this.attemptIdx()-1]];
	}

	shortName() {
		let shortLiftName = '';
		switch (this.liftName.toLowerCase()) {
			case 'squat':
				shortLiftName = "SQ";
				break;
			case 'bench':
				shortLiftName = "BP";
				break;
			case 'deadlift':
				shortLiftName = "DL";
				break;
		}
		return shortLiftName + ' ' + this.attemptNumber;
	}

	longName() {
		return this.liftName + ' #' + this.attemptNumber;
	}

	frameWhenClickedOn() {
		if (!this.hasFrame()) return false;
		let frame;
		if (!!this.lightsTime && (this.lightsTime - this.lastNameTime) < 40) { // todo framerate
			frame = Math.max(this.lightsTime - 25, this.firstNameTime); //todo
		} else if (!!this.firstNameTime) {
			frame = parseInt((this.firstNameTime + this.lastNameTime) / 2, 10);
		} else {
			return false;
		}

		return frame;
	}

	hasOccurredAsOf(asOfAttempt, falseIfSameAttempt=false) {
		if (!asOfAttempt) {
			return false;
		}
		const asOfAppearance = asOfAttempt._appearance;

		if (this.liftIdx() < asOfAttempt.liftIdx()) return true;
		if (this.liftIdx() > asOfAttempt.liftIdx()) return false;

		if (this._appearance.flight !== asOfAppearance.flight) {
			return this._appearance.flight < asOfAppearance.flight;
		}

		if (isNaN(+this.weight)) { return false; }
		if (isNaN(+asOfAttempt.weight)) { return true; }

		if (+this.attemptIdx() < +asOfAttempt.attemptIdx()) { return true; }
		if (+this.attemptIdx() > +asOfAttempt.attemptIdx()) { return false; }

		if (+this.weight < +asOfAttempt.weight) { return true; }
		if (+this.weight > +asOfAttempt.weight) { return false; }

		return falseIfSameAttempt ? 
			(+this._appearance.lot < +asOfAttempt._appearance.lot) : 
			(+this._appearance.lot <= +asOfAttempt._appearance.lot);
	}

	hasBeenSubmittedAsOf(asOfAttempt) {
		// //console.log(asOfAttempt);
		if (this.hasOccurredAsOf(asOfAttempt)) {
			return true;
		}
		// check if uncompleted opener
		if (this.attemptNumber === '1') {
			return true;
		} 


		// check if previous lift has already occurred - in this case, show next submitted attempt
		// if (attempt.attemptIdx() > 0) {
		const prevAttempt = this.prevAttempt();
		if (prevAttempt) {
			const prevAttemptHasHappened = prevAttempt.hasOccurredAsOf(asOfAttempt, true);
			if (prevAttemptHasHappened) {
				return true;
			} else {
				return false;
			}
		}
		console.warn('previous attempt does not exist');
		return false;
	}

	compUrlPath() {
		const attempt = this;
		const params = Serializer.serializeParams({
			lifter: attempt._lifter.name,
			weightClass: attempt._appearance.weightClass,
			division: attempt._appearance.division,
			attempt: attempt.attemptName,
		})
		return '/comp/'+ attempt._competition.name + '?' + queryString.stringify(params)
	}

	recordsLong() {
		if (!this.records) return '';
		let geo = '';
		let div = '';

		switch (this.records.substr(0,1).toLowerCase()) {
			case 'w':
				geo = 'World';
				break;
			case 'c':
				geo = 'Continental';
				break;
		}

		switch (this.records.substr(-1)) {
			case '1':
			case '2':
			case '3':
			case '4':
				div = 'Masters ' + this.records.substr(-1);
				break;
			case 'j':
				div = 'Junior';
				break;
			case 's':
				div = 'Subjunior';
				break;
			default:
				if (this.records.length === 1) {
					div = 'Open';
				}
		}

		return geo + ' ' + div + ' Record';
	}

	kgString() {
		return this.weight + ' kg';
	}

	lbString() {
		const LBS_IN_KILO = 2.20462;
		const weightInPounds = this.weight * LBS_IN_KILO;
		const lbWeightString = Math.round(weightInPounds * 10) / 10 + ' lb';
		return lbWeightString;
	}
	
}	

export default Attempt