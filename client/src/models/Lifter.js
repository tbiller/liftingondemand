import Appearance from './Appearance';


class Lifter {
	constructor(props) {
		this._id = props._id;
		this.name = props.name;
		this.yob = props.yob;
		this.appearances = [];
		if (props.appearances !== null && props.appearances.length > 0) {
			if (typeof(props.appearances[0]) === 'object') {
				this.appearances = props.appearances.map((appearanceJson) => {
					return new Appearance(appearanceJson, this);
				});
				this.recentWeightClass = this.appearances[0].weightClass;
			}
		}


	}

	lastName() {
		return this.name.split(' ')[0];
	}

	shortName(maxChars=14) {
		let name = this.name.substr(0, maxChars);
		if (this.name.length > maxChars && this.name.substr(maxChars-1, 1) !== ' ') {
			name += '.';
		}
		return name;
	}
}

export default Lifter;