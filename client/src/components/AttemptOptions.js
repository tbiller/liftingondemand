import React, { Component } from 'react';
import OptionSelect from './OptionSelect';
import deepEqual from 'deep-equal';
import '../styles/components/AttemptOptions.css';

export default function({
	optionChange,
	filters
}) {

	function createOption(optType, val) {
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

	function createOptions(vals, currentValue, suffix='', clearDefaultLabel=false, allowNoChoice=true) {
		//console.log(currentValue);
		const selectOptions = [];
		let selectedValue = null;

		if (allowNoChoice) selectOptions.push({value: '', label: ' -- all -- '});

		vals.forEach((val) => {
			selectOptions.push({value: val, label: val + suffix});
			if (currentValue === val) selectedValue = selectOptions[selectOptions.length - 1];
		});
		if (clearDefaultLabel && allowNoChoice) {
			if (selectedValue === null && currentValue) {
				selectOptions[0].label= '';
			}
		}
		return { selectOptions, selectedValue };

	}

	const liftOptsObj = createOptions(['Squat', 'Bench', 'Deadlift'], filters['lift']);
	const styleOptsObj = createOptions(['Raw', 'Equipped'], filters['style']);
	const divisionOptsObj = createOptions(['Open', 'Junior', 'M1'], filters['division']);

	const maleWeightclasses = ['59', '66', '74', '83', '93', '105', '120', '120+'];
	const femaleWeightclasses = ['47', '52', '57', '63', '72', '84', '84+'];

	const maleWeightclassOptsObj = createOptions(maleWeightclasses, filters['weightclass'], ' kg', true);
	const femaleWeightclassOptsObj = createOptions(femaleWeightclasses, filters['weightclass'], ' kg', true);
	const sortOptsObj = createOptions(['Weight', 'Stars'], filters['sortBy'], '', false, false);
	return (
		<div className='attempt-options-container'>
			<div className='attempt-options'>
				<OptionSelect 
					optionChange={optionChange} 
					optionType='lift' 
					title='Lift' 
					options={liftOptsObj.selectOptions} 
					initialValue={liftOptsObj.selectedValue}
				/>
				<OptionSelect 
					optionChange={optionChange} 
					optionType='style' 
					title='Style' 
					options={styleOptsObj.selectOptions} 
					initialValue={styleOptsObj.selectedValue}
				/>
				<div className='vertical-divider'>&nbsp;</div>			
				<OptionSelect 
					optionChange={optionChange} 
					optionType='weightclass' 
					title='Male' 
					options={maleWeightclassOptsObj.selectOptions} 
					initialValue={maleWeightclassOptsObj.selectedValue}
				/>
				<OptionSelect 
					optionChange={optionChange} 
					optionType='weightclass' 
					title='Female' 
					options={femaleWeightclassOptsObj.selectOptions} 
					initialValue={femaleWeightclassOptsObj.selectedValue}
				/>	
				<OptionSelect 
					optionChange={optionChange} 
					optionType='division' 
					title='Division' 
					options={divisionOptsObj.selectOptions} 
					initialValue={divisionOptsObj.selectedValue}
				/>
				<div className='vertical-divider'>&nbsp;</div>			
				<OptionSelect 
					optionChange={optionChange} 
					optionType='sortBy' 
					title='Sort By' 
					options={sortOptsObj.selectOptions} 
					initialValue={sortOptsObj.selectedValue}
				/>
			</div>
		</div>
	);

}

	

	 	// <OptionSelect optionChange={optionChange} optionType='weightClass' title='Male' options={maleWeightclassOptions} initialValue={defaultMaleWeightclass} />
			// 	    	<OptionSelect optionChange={optionChange} optionType='division' title='Division' options={divisionOptions} initialValue={defaultDivision} />
			
			// 	<div className='option-group lift'>
			// 		<div className='title'>Lift</div>
			// 		{this.createOptions('lift', ['Squat', 'Bench', 'Deadlift'])}
			// 	</div>
			// 	<div className='option-group style'>
			// 		<div className='title'>Style</div>
			// 		{this.createOptions('style', ['Raw', 'Equipped'])}
			// 	</div>
			// 	<div className='option-group division'>
			// 		<div className='title'>Division</div>
			// 		{this.createOptions('division', ['Open', 'Junior', 'M1'])}
			// 	</div>