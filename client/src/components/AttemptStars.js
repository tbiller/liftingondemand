import React from 'react';

export default function({
	attempt,
	starAttempt,
	starredAttempts
}) {
	const hasStarredThisAttempt = starredAttempts ? 
		starredAttempts.indexOf(attempt._id) !== -1 : false;
	const buttonText = hasStarredThisAttempt ? 'Starred' : 'Star';
	console.log('buttonText', starredAttempts);
	return (
		<div className='attempt-stars'>
	    	<span>({attempt.numStars})</span>
	    	<div className='button' onClick={starAttempt}>
	    		{buttonText}
	    	</div>
	   </div>	

	)
}
	