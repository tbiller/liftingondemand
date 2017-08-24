import React, { Component } from 'react';

export default function({ 
	currentAttempt,
	incrementLiftersLift,
	incrementLifter,
	advanceBySeconds
}) {

	// function()
	// if (!currentAttempt) {
	// 	return null;
	// }
	// const names = currentLifter.name.split(' ');
	// const lastName = names[0];
	// const lastNameShortened = lastName.substr(0, 15);

	return (
		<div className='player-controls'>
				{ currentAttempt && 
					<div className='button lift-button left' onClick={() => incrementLifter(-1)}>
						&lt;&lt; Prev Lifter
					</div>
				}
				<div className='button seek-button left' onClick={() => advanceBySeconds(-10)}>&lt;&lt; 10 secs</div>
				<div className='button seek-button right' onClick={() => advanceBySeconds(10)}>10 secs &gt;&gt;</div>
				{ currentAttempt && 
					<div className='button lift-button right' onClick={() => incrementLifter(1)}>
						Next Lifter &gt;&gt;
					</div>
				}
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