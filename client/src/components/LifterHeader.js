import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { capitalize } from '../utils/general';

export default function({
	lifter,
}) {
	// const weightClassSuffix = competition ? competition.options.weightClassSuffix : 'kg';

	// const path = competition ? '/comp/' + competition.name + '?' + queryString.stringify({division, weightClass}) : '';
	return (
		// <Link to={path}>
			<div className='lifter-header'>
				<div className='title-and-indicator'>
										<div className='lifter-name'>
			    		{lifter ? lifter.name : ''}
			    	</div>
				</div>
		    	
		    	<div className='yob'>
		    		{lifter ? 'YoB: ' + lifter.yob : ''}
		    	</div>
			</div>
		// </Link>
	);
}

// <div className='route-indicator'>
// 						Lifter
// 					</div>
