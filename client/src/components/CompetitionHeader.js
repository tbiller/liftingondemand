import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OptionSelect from './OptionSelect';
import queryString from 'query-string';
import { capitalize } from '../utils/general';
import '../styles/components/CompetitionHeader.css';


export default function({
	competition,
	division,
	weightClass,
	boolShowOptions = false,
	toggleOptions,
	optionsShown,
	optionChange
}) {
	const weightClassSuffix = competition ? competition.options.weightClassSuffix : 'kg';
	const path = competition ? '/comp/' + competition.name + '?' + queryString.stringify({division, weightClass}) : '';
	
	let femaleWeightclassOptions = [], maleWeightclassOptions = [], divisionOptions = [];
	let defaultMaleWeightclass = {}, defaultFemaleWeightclass = {}, defaultDivision = {};


	function createSelectOptions(opts, suffix) {
		const selectOptions = [];
		opts.forEach((opt) => {
			let value, label;
			if (Array.isArray(opt)) {
				label = opt[0];
				value = opt[1];
			} else {
				label = value = opt;
			}
			label += suffix;
			selectOptions.push({value, label});
		});

		return selectOptions;
	}

	if (competition) {
		const maleWeightclasses = competition.options.weightClasses[0];
		const femaleWeightclasses = competition.options.weightClasses[1];
		const suffix = competition.options.weightClassSuffix;

		maleWeightclassOptions = createSelectOptions(maleWeightclasses, suffix ? ' ' + suffix : '');
		femaleWeightclassOptions = createSelectOptions(femaleWeightclasses, suffix ? ' ' + suffix : '');
		divisionOptions = createSelectOptions(competition.options.divisions, '');

		maleWeightclassOptions.forEach((opt) => {
			if (opt.value === weightClass) defaultMaleWeightclass = opt;
		});

		femaleWeightclassOptions.forEach((opt) => {
			if (opt.value.toLowerCase() === weightClass.toLowerCase()) defaultFemaleWeightclass = opt;
		})

		divisionOptions.forEach((opt) => {
			if (opt.value === division) defaultDivision = opt;
		})
	}


	return (
		<div>
			<div className='competition-header'>
	    		<div className='left competition-date'>
		    		{competition ? competition.dates : ''}
	    		</div>
		    	<div className='center competition-title'>
		    		{competition ? competition.name : ''}
		    	</div>
			    <div className='right'>
			    	<div className='options'>
				    	<OptionSelect optionChange={optionChange} optionType='weightClass' title='Female' options={femaleWeightclassOptions} initialValue={defaultFemaleWeightclass} />
				    	<OptionSelect optionChange={optionChange} optionType='weightClass' title='Male' options={maleWeightclassOptions} initialValue={defaultMaleWeightclass} />
				    	<OptionSelect optionChange={optionChange} optionType='division' title='Division' options={divisionOptions} initialValue={defaultDivision} />
				    </div>
			    </div>
			</div>
		</div>
	);
}
// {weightClass && 
// 					<div onClick={(e)=> {
// 						e.stopPropagation();
// 						if (boolShowOptions) toggleOptions();
// 					}} className='active-division'>
// 						{weightClass +  weightClassSuffix + '  ' + capitalize(division)}
// 						{boolShowOptions &&
// 							<img className={['arrow', optionsShown ? 'rotated' : ''].join(' ')} src= {require('../images/arrow-down.png')} />
// 						}
// 					</div>
// 				}
	    			// <div className='route-indicator'>Competition</div>
//<div className='active-division option'>
		    	// 	<div className='option-title'>Division</div>
		    	// 	{division}
		    	// </div>
		    	// <div className='active-weightclass option'>
		    	// 	<div className='option-title'>Weightclass</div>
		    	// 	{weightClass}
		    	// </div>