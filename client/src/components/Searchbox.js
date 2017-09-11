import React, { Component } from 'react';
import { capitalize } from '../utils/general';
import { Link } from 'react-router-dom';
import '../styles/components/Searchbox.css';

class Searchbox extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };
	}

	componentDidUpdate() {
		// console.log(this.matchingModels(this.state.value));
	}

	handleChange = (e) => {
		let matches = [];
		const newValue = e.target.value;
		if (newValue.length >= this.props.minCharacters) {
			matches = this.matchingModels(newValue);
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
		
		console.log(matches)

		return matches;
	}

	// handleSubmit = (e) => {

	// }

	// createEls = (name, matches, maxItems, generateLink, mainKey, sideKey, sidePrefix='') => {
	// 	const els = [];
	// 	els.push(<div key={name + 'title'} className='searchbox-title'>{capitalize(name) + 's'}</div>);
	// 	for (let i = 0; i < matches.length; i++) {
	// 		const match = matches[i];
	// 		els.push(
	// 			<Link to={generateLink(match)} key={name+i}>
	// 				<div onClick={() => this.setState({value: ''})} key={name + i} className={'searchbox-option ' + name}>
	// 					<span className='mainKey'>{match[mainKey]}</span>
	// 					{sideKey &&
	// 						<span className='sideKey'>{sidePrefix + match[sideKey]}</span>
	// 					}
	// 				</div>
	// 			</Link>
	// 		);
	// 		if (i + 1 >= maxItems) {
	// 			els.push(
	// 				<div key={name + 'note'} className='searchbox-note'>{matches.length - maxItems} additional matches</div>
	// 			)
	// 			break;
	// 		}
	// 	}

	// 	if (matches.length === 0) {
	// 		els.push(
	// 			<div key={name + 'noMatches'} className='searchbox-note'>No matches found</div>
	// 		)
	// 	}
	// 	return els;
	// }

	// listboxEls = () => {
	// 	if (this.state.value.length < 2) return null; 
	// 	const maxItems = 7;
	// 	// const lifterEls = [], competitionEls = [];
	// 	const { matchingLifters, matchingCompetitions } = this.matchingModels(this.state.value);
		
	// 	const lifterEls = this.createEls('lifter', matchingLifters, maxItems, (match) => {
	// 		return '/lifter/' + match._id;
	// 	},
	// 	'name', 'yob', 'YoB: ');
	// 	const competitionEls = this.createEls('competition', matchingCompetitions, maxItems, (match) => {
	// 		return '/comp/' + match.name;
	// 	}, 'name', 'dates');

	// 	return (
	// 		<div>
	// 			<div>{lifterEls}</div>
	// 			<div className='divider' />
	// 			<div>{competitionEls}</div>
	// 		</div>
	// 	);

	// 	return lifterEls.concat(competitionEls);
	// // }


	// handleBlur = (e) => {
	// 	// console.log('blurred');
	// 	window.setTimeout(() => {this.setState({'value': ''})}, 400);
	// }

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