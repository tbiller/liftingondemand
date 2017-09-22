import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { capitalize } from '../utils/general';
import '../styles/components/CompetitionHeader.css';


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
		<div>
			<div className='competition-header'>
	    		<div className='competition-date'>
		    		{competition ? competition.dates : ''}
	    		</div>
	    		<div className='title-and-indicator'>
			    	<div className='competition-title'>
			    		{competition ? competition.name : ''}
			    	</div>
			    </div>
		    	<div className='active-division option'>
		    		<div className='option-title'>Division</div>
		    		{division}
		    	</div>
		    	<div className='active-weightclass option'>
		    		<div className='option-title'>Weightclass</div>
		    		{weightClass}
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
