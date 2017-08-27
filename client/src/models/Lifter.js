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
}

export default Lifter;