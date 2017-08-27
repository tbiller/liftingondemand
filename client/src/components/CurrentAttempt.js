import React, { Component } from 'react';

export default function({
	attempt
}) {
	if (!attempt) {
		return null;
	}
	const LBS_IN_KILO = 2.20462;
	const weight = attempt ? attempt.weight : '';
	const weightInPounds = weight ? weight * LBS_IN_KILO : '';

	const kgWeightString = weight ? weight + ' kg' : '';
	const lbWeightString = weight ? Math.round(weightInPounds * 10) / 10 + ' lb' : '';

	return (
		<div className='current-attempt'>
		    <div className='current-attempt-name'>{attempt.attemptName}</div>
		    <div className='current-weight'>
		    	{kgWeightString} ({lbWeightString})
		    </div>
		</div>
	);
}
