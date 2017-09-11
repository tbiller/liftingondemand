import React, { Component } from 'react';
import YoutubePlayer from './YoutubePlayer';
import AttemptStars from './AttemptStars';
import '../styles/components/AttemptCard.css';

export default function({
	attempt,
	starAttempt,
	starredAttempts,
	isActive,
	onClick
}) {
	function playerUpdated() {

	}

	if (!attempt) return null;
	return (
		<div className='attempt-card' onClick={onClick}>
			<div className='info'>
				<div>
					<div className='lift'>{attempt.liftName}</div>
					<div className='kg-weight'>{attempt.kgString()}</div>
					<div className='lb-weight'>{attempt.lbString()}</div>
				</div>
				<div className='lifter-name'>{attempt._lifter.name}</div>
				{attempt.records &&
				    <div className='records'>
				    	{attempt.recordsLong()}
				    </div>
			    }
				<div className='competition-name'>{attempt._competition.name}</div>
			</div>
			
		    {isActive ? 
			    <YoutubePlayer 
			    	attemptToBeSelected={attempt}
					secondsToAdvance={0}
					playerUpdated={playerUpdated}
					framerate={30}
					showMessage={false}
					/>
			:
				<div className='empty-player' />
			}
			<AttemptStars attempt={attempt} starAttempt={(e)=> {
				starAttempt(attempt);
				console.log('stropping stopPropagation')
				e.stopPropagation();
			}} starredAttempts={starredAttempts} />
		</div>
	);
}