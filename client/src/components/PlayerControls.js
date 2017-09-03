import React, { Component } from 'react';

export default function({ 
	currentAttempt,
	incrementLiftersLift,
	// incrementLifter,
	advanceBySeconds,
	selectLiftAttempt,
	editMode,
	previousAttempt,
	nextAttempt,
	children
}) {

	// function()
	// if (!currentAttempt) {
	// 	return null;
	// }
	// const names = currentLifter.name.split(' ');
	// const lastName = names[0];
	// const lastNameShortened = lastName.substr(0, 15);
	function attemptClick(attempt) {
		if (attempt) {
			selectLiftAttempt({attempt});
		}
	}
	return (
		<div className='controls-and-player'>
			<div className='controls left'>
				<div 
					className={['lift-button left', previousAttempt ? 'clickable' : ''].join(' ')}
					onClick={()=>attemptClick(previousAttempt)}>
					{ previousAttempt && 
							<div>
								<img className='arrow left' src= {require('../images/arrow-right.png')} />
								<div className='lifter-name'>{previousAttempt._lifter.shortName()}</div>
								<div className='attempt'>{previousAttempt.attemptName}: {previousAttempt.weight} kg</div>
							</div>
					}
				</div>
				{editMode && 
					<div>
						<div className='seek-button left clickable' onClick={() => advanceBySeconds(-60)}>&lt;&lt; 60 secs</div>
						<div className='seek-button left clickable' onClick={() => advanceBySeconds(-30)}>&lt;&lt; 30 secs</div>
					</div>
				}
				<div className='seek-button left clickable' onClick={() => advanceBySeconds(-10)}>&lt;&lt; 10 secs</div>
			</div>
			{children}
			<div className='controls right'>
				
				<div
					className={['lift-button right', nextAttempt ? 'clickable' : ''].join(' ')}
					onClick={()=>attemptClick(nextAttempt)}>
					{ nextAttempt && 
							<div>
								<img className='arrow right' src= {require('../images/arrow-right.png')} />
								<div className='lifter-name'>{nextAttempt._lifter.shortName()}</div>
								<div className='attempt'>{nextAttempt.attemptName}: {nextAttempt.weight} kg</div>
							</div>
					}
				</div>
				{editMode && 
					<div>
						<div className='seek-button right clickable' onClick={() => advanceBySeconds(30)}>30 secs &gt;&gt;</div>
						<div className='seek-button right clickable' onClick={() => advanceBySeconds(60)}>60 secs &gt;&gt;</div>	
					</div>
				}
				<div className='seek-button right clickable' onClick={() => advanceBySeconds(10)}>10 secs &gt;&gt;</div>
			</div>
	   	</div>
    );
}
			// </div>
			// <div className='next-lift control-group'>

			// 	<div className='button lift-button left' onClick={() => incrementLiftersLift(-1)}>
			// 		{liftersPrevAttempt &&
			// 			liftersPrevAttempt.liftAttempt
			// 		}
			// 	</div>
			// 	<div className='button lift-button right' onClick={() => incrementLiftersLift(1)}>
			// 		{lastNameShortened}'s Next Lift
			// 	</div>
			// </div>
			// 		<div className='next-lifter control-group'>
	
			// </div>