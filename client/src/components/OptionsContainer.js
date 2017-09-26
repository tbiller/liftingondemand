import React, { Component } from 'react';
import Option from './Option';

export default function({activeOpts, optionClick, weightClasses, divisions, weightClassAlign}) {
	// const weightClasses = {
	// 	'male': [
	// 		'59',
	// 		'66',
	// 		'74',
	// 		'83',
	// 		'93',
	// 		'105',
	// 		'120',
	// 		'120+'],
	// 	'female': [
	// 		'47',
	// 		'52',
	// 		'57',
	// 		'63',
	// 		'72',
	// 		'84',
	// 		'84+' ]
	// };

	// const divisions = [
	// 	'Open',
	// 	'Junior'
	// ];

	const leaderboardTypes = [
		['Final Results', 'final'],
		['In the Moment', 'live']
	]

	function isActive(optType, opt) {
		return ('' + activeOpts[optType]).toLowerCase() === ('' + opt).toLowerCase();
	}

	const createOptions = (optArr, optType) => {
		const options = [];
		optArr.forEach((opt) => {
			let display, value;
			if (Array.isArray(opt)) {
				display = opt[0];
				value = opt[1];
			} else {
				display = opt;
				value = ('' + opt).toLowerCase();
			}
			options.push(
				<Option 
					optType={optType} 
					key={value}
					value={value} 
					displayValue={display}
					activeValue={activeOpts[optType]}
					optionClick={optionClick}
				/>
			); 
		});
		return options;
	}

	const weightClassGroups = [];
	let i = 0;
	if (weightClasses) {
		//console.log(weightClasses);
		weightClasses.forEach((weightClassGroup) => {
			weightClassGroups.push(
				<div key={i++} className='specific-options'>{createOptions(weightClassGroup, 'weightClass')}</div>
			);
		});
	}

	return (
		<div className='all-options'>
			
			<div className='options-container'>
				<div className='options-title'>Weight Class</div>
				{ weightClasses &&
					<div className={['weight-classes', 'options', weightClassAlign || ''].join(' ')}>
						{weightClassGroups}
					</div>
				}
			</div>
			<div className='options-container divisions'>
				<div className='options-title'>Division</div>
				{ divisions &&
					<div className='options'>
						<div className='specific-options'>{createOptions(divisions, 'division')}</div>
					</div>
				}
			</div>
		</div>
	);
}

// <div className='options-container leaderboard'>
// 				<div className='options-title'>Leaderboard View</div>
// 				<div className='options'>
// 					<div className='specific-options'>{createOptions(leaderboardTypes, 'leaderboardType')}</div>
// 				</div>
// 			</div>
	// <div className='divisions'>{createOptions(divisions, 'division')}</div>
