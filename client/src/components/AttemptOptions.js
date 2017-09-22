import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import '../styles/components/AttemptOptions.css';

class AttemptOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lift: '',
			weightclass: '',
			division: ''
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (!deepEqual(prevState, this.state)) {
			this.props.recordFilters(this.state);
		}
	}

	optionClick(optType, val) {
		if (this.state[optType] === val) {
			// clear filter
			this.setState({[optType]: ''});
		} else {
			// set filter
			this.setState({[optType]: val});
		}
	}

	createOption(optType, val) {
		const isActive = this.state[optType] ? this.state[optType] === val : false;
		const inActive = !isActive && this.state[optType];
		return (
			<div 
				key={optType + val}
				className={['option', optType, isActive ? 'active' : '', inActive ? 'inactive' : ''].join(' ')} 
				onClick={this.optionClick.bind(this, optType, val)}>
				{val}
			</div>
		);
	}

	createOptions(optType, vals) {
		const opts = [];

		vals.forEach((val) => {
			opts.push(this.createOption(optType, val));
		});
		return <div className='option-list'>{opts}</div>;
	}

	render() {
		return (
			<div className='attempt-options'>
				<div className='option-group lift'>
					<div className='title'>Lift</div>
					{this.createOptions('lift', ['Squat', 'Bench', 'Deadlift'])}
				</div>
				<div className='option-group style'>
					<div className='title'>Style</div>
					{this.createOptions('style', ['Raw', 'Equipped'])}
				</div>
				<div className='option-group division'>
					<div className='title'>Division</div>
					{this.createOptions('division', ['Open', 'Junior', 'M1'])}
				</div>
			</div>
		);
	}
}

export default AttemptOptions;
	