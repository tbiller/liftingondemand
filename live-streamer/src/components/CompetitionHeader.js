import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { capitalize } from '../utils/general';

export default function({
	competition,
	division,
	weightClass,
	boolShowOptions = false,
	toggleOptions,
	optionsShown
}) {
	const weightClassSuffix = competition ? competition.options.weightClassSuffix : 'kg';

	const path = competition ? '/comp/' + competition.name + '?' + queryString.stringify({division, weightClass}) : '';
	return (
		<Link to={path}>
			<div className='competition-header'>
	    		<div className='competition-date'>
		    		{competition ? competition.dates : ''}
	    		</div>
		    	<div className='competition-title'>
		    		{competition ? competition.name : ''}
		    	</div>
		    	{weightClass && 
					<div onClick={(e)=> {
						e.stopPropagation();
						if (boolShowOptions) toggleOptions();
					}} className='active-division'>
						{weightClass +  weightClassSuffix + '  ' + capitalize(division)}
						{boolShowOptions &&
							<img className={['arrow', optionsShown ? 'rotated' : ''].join(' ')} src= {require('../images/arrow-down.png')} />
						}
					</div>
				}
			</div>
		</Link>
	);
}