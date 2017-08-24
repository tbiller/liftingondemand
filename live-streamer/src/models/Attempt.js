const liftsInOrder = ['Squat 1', 'Squat 2', 'Squat 3', 'Bench 1', 'Bench 2', 'Bench 3',
			'Deadlift 1', 'Deadlift 2', 'Deadlift 3'];		

class Attempt {
	constructor(attemptJson, appearance, attemptName, liftsInOrder) {
		this._lifter = appearance._lifter;
		this._appearance = appearance;
		this.firstNameFrame = attemptJson.firstNameFrame;
		this.lastNameFrame = attemptJson.lastNameFrame;
		this.liftName = attemptName.split(' ')[0];
		this.attemptNumber = attemptName.split(' ')[1];
		this.attemptName = attemptName;
		// this.lights = attemptJson.lights;
		this.lightsFrame = attemptJson.lightsFrame;
		this.result = attemptJson.result;
		this.weight = attemptJson.weight;
		this.records = attemptJson.records;

		if (this.lastNameFrame && this.firstNameFrame) {
			if (this.lastNameFrame - this.firstNameFrame > 30 * 120) {
				this.firstNameFrame = this.lastNameFrame;
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
		return !!this.firstNameFrame || !!this.lastNameFrame || !!this.lightsFrame;
	}

	prevAttempt() {
		if (this.attemptIdx() === 0) return null;
		return this._appearance.attempts[liftsInOrder[this.attemptIdx()-1]];
	}

	frameWhenClickedOn() {
		if (!this.hasFrame()) return false;
		let frame;
		if (!!this.lightsFrame && (this.lightsFrame - this.lastNameFrame) < (60 * 30)) { // todo framerate
			frame = this.lightsFrame - 25 * 30; //todo
		} else if (!!this.firstNameFrame) {
			frame = parseInt((this.firstNameFrame + this.lastNameFrame) / 2, 10);
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
		// console.log(asOfAttempt);
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
}	

export default Attempt