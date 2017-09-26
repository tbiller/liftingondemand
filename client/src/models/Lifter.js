import Appearance from './Appearance';
import { title } from '../utils/general';

class Lifter {
	constructor(json, fromJson=true) {
		this._id = json._id;
		this.name = json.name;
		this.yob = json.yob;
		this.appearances = [];

		if (fromJson == true) {
			if (json.appearances && json.appearances.length > 0) {
				if (typeof(json.appearances[0]) === 'object') {
					this.appearances = json.appearances.map((appearanceJson) => {
						return new Appearance(appearanceJson, this);
					});
					this.recentWeightClass = this.appearances[0].weightClass;
					this.weightClassSuffix = isNaN(parseInt(this.recentWeightClass, 10)) ? '' : 'kg';
					this.recentWeightClassLong = title(this.recentWeightClass) + ' ' + this.weightClassSuffix;
				}
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