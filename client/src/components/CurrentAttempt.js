import React, { Component } from 'react';

export default function({
	attempt,
}) {
	if (!attempt) {
		return null;
	}


	return (
		<div className='current-attempt'>
				
		    <div className='current-weight'>
		    	<span className='kg-weight'>{attempt.kgString()}</span>
		    	<span className='lb-weight'>{attempt.lbString()}</span>
		    </div>

		    {attempt.records &&
		    <div className='records'>
		    	{attempt.recordsLong()}
		    </div>
		    }
		</div>
	);
}

		    // <div className='current-attempt-name'>{attempt.attemptName}</div>
