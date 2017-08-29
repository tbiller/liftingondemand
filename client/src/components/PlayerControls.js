import React, { Component } from 'react';

export default function({ 
	currentAttempt,
	incrementLiftersLift,
	incrementLifter,
	advanceBySeconds,
	editMode,
	children
}) {

	// function()
	// if (!currentAttempt) {
	// 	return null;
	// }
	// const names = currentLifter.name.split(' ');
	// const lastName = names[0];
	// const lastNameShortened = lastName.substr(0, 15);

	return (
		<div className='controls-and-player'>
			<div className='controls left'>
				{ (currentAttempt && incrementLifter) && 
					<div className='lift-button left' onClick={() => incrementLifter(-1)}>
						&lt;&lt; Prev Lifter
					</div>
				}
				{editMode && 
					<div>
						<div className='seek-button left' onClick={() => advanceBySeconds(-60)}>&lt;&lt; 60 secs</div>
						<div className='seek-button left' onClick={() => advanceBySeconds(-30)}>&lt;&lt; 30 secs</div>
					</div>
				}
				<div className='seek-button left' onClick={() => advanceBySeconds(-10)}>&lt;&lt; 10 secs</div>
			</div>
			{children}
			<div className='controls right'>
				
				{ (currentAttempt && incrementLifter) && 
					<div className='lift-button right' onClick={() => incrementLifter(1)}>
						Next Lifter &gt;&gt;
					</div>
				}
				<div className='seek-button right' onClick={() => advanceBySeconds(10)}>10 secs &gt;&gt;</div>

				{editMode && 
					<div>
						<div className='seek-button right' onClick={() => advanceBySeconds(30)}>30 secs &gt;&gt;</div>
						<div className='seek-button right' onClick={() => advanceBySeconds(60)}>60 secs &gt;&gt;</div>	
					</div>
				}
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