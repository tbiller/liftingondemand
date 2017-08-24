import React, { Component } from 'react';
import { capitalize } from '../utils/general';

export default function({
	competition,
	division,
	weightClass,
	weightClassSuffix,
	boolShowOptions,
	toggleOptions,
	optionsShown
}) {

	return (
		<div className='competition-header'>
    		<div className='competition-date'>
	    		{competition ? competition.dates : ''}
    		</div>
	    	<div className='competition-title'>
	    		{competition ? competition.name : ''}
	    	</div>
	    	{(boolShowOptions && weightClass) && 
				<div onClick={(e)=> {
					e.stopPropagation();
					toggleOptions()
				}} className='active-division'>
					{weightClass +  weightClassSuffix + '  ' + capitalize(division)}
					<img className={['arrow', optionsShown ? 'rotated' : ''].join(' ')} src= {require('../images/arrow-down.png')} />
				</div>
			}
		</div>
	);
}