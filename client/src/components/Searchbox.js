import React, { Component } from 'react';
import { capitalize } from '../utils/general';
import { Link } from 'react-router-dom';
import '../styles/components/Searchbox.css';

class Searchbox extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };
	}

	componentDidMount() {
		if (this.props.allOptions.length > 0) {
			this.props.reportMatches(this.props.allOptions);
		}
	}

	componentWillReceiveProps(nextProps) {
		// console.log('allOptions', this.props.allOptions);
		if (this.props.allOptions.length === 0 && nextProps.allOptions.length > 0) {
			this.props.reportMatches(nextProps.allOptions);
		}
	}

	handleChange = (e) => {
		let matches = [];
		const newValue = e.target.value;
		if (newValue.length >= this.props.minCharacters) {
			matches = this.matchingModels(newValue);
		} else if (newValue.length === 0) {
			matches = this.props.allOptions;
		}
		this.props.reportMatches(matches);
	}

	performRegex = (arr, key, regs) => {
		return arr.filter((el) => {
			if (!el[key]) return false;
			for (let i = 0; i < regs.length; i++) {
				if (!regs[i].test(el[key])) {
					return false;
				}
			}
			return true;
		});
	}

	matchingModels = (str) => {
		let matches, regs = [];
		const strParts = str.split(' ');

		for (let i = 0; i < strParts.length; i++) {
			regs.push(new RegExp('(?:^| )(' + strParts[i] + ')', 'i'));
		}
		
		if (this.props.allOptions) matches = this.performRegex(this.props.allOptions, 'name', regs);
		return matches;
	}

	render() {
		return (
			<div className='searchbox'>
				<input 
					type='text' 
					// value={this.state.value}
					onChange={this.handleChange} 
					// onSubmit={this.handleSubmit}
					// onBlur={this.handleBlur}
					placeholder={this.props.placeholder}
				/>
			</div>
		)
	}
}

export default Searchbox;