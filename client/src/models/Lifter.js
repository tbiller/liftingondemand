import Appearance from './Appearance';


class Lifter {
	constructor(props) {
		this._id = props._id;
		this.name = props.name;
		this.yob = props.yob;
		this.appearances = props.appearances.map((appearanceJson) => {
			return new Appearance(appearanceJson, this);
		});
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