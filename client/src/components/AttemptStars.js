import React from 'react';
import '../styles/components/AttemptStars.css';

export default function({
	attempt,
	starAttempt,
	isStarred
}) {

	const buttonText = isStarred ? 'Starred' : 'Star';
	return (
		<div className='attempt-stars' onClick={starAttempt}>
			{isStarred ? 
				<img className='star' src= {require('../images/star.png')} />
			:
				<img className='star' src= {require('../images/unstar.png')} />
			}
	    	<span className='num-stars'>{attempt.numStars}</span>
	   </div>	

	)
}
	