import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default function({ 
	currentAttempt,
	incrementLiftersLift,
	advanceBySeconds,
	selectLiftAttempt,
	editMode,
	previousAttempt,
	nextAttempt,
	className,
	showReplay,
	replayAttempt,
	showWatchMore,
	attemptForWatchMore,
	children
}) {
	if (currentAttempt) {
		const currentLifterAppearance = currentAttempt._appearance;
		var liftersNextAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, 1);
		var liftersPreviousAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, -1);
	}
	function attemptClick(attempt) {
		if (attempt) {
			selectLiftAttempt({attempt});
		}
	}
	return (
		<div className={['controls-and-player', className].join(' ')}>
			<div className='controls left'>
				<div 
					className={['lift-button current-lifter left', liftersPreviousAttempt ? 'clickable' : ''].join(' ')}
					onClick={()=>attemptClick(liftersPreviousAttempt)}>
					{ liftersPreviousAttempt && 
							<div>
								<div className='title-container left'>
									<img className='arrow left' src= {require('../images/arrow-right.png')} />
									<div className='title'>Prev. Lift</div>
								</div>
								<div className='attempt'>{liftersPreviousAttempt.attemptName}: {liftersPreviousAttempt.weight} kg</div>
							</div>
					}
				</div>
				
				{ previousAttempt && 
					<div 
						className={['lift-button left', previousAttempt ? 'clickable' : ''].join(' ')}
						onClick={()=>attemptClick(previousAttempt)}>
					
							<div>
								<div className='title-container left'>
									<img className='arrow left' src= {require('../images/arrow-right.png')} />
									<div className='title'>Prev. Lifter</div>
								</div>
								<div className='lifter-name'>{previousAttempt._lifter.shortName()}</div>
							</div>
					</div>
				}
				{editMode && 
					<div>
						<div className='seek-button left clickable' onClick={() => advanceBySeconds(-60)}>&lt;&lt; 60 secs</div>
						<div className='seek-button left clickable' onClick={() => advanceBySeconds(-30)}>&lt;&lt; 30 secs</div>
					</div>
				}
				{showReplay && 
					<div className='seek-button left clickable' onClick={(e) => {e.stopPropagation(); replayAttempt();}}>
						<div className='title-container left'>
							<img className='arrow left' src= {require('../images/arrow-right.png')} />
							<div className='title'>Replay</div>
						</div>
					</div>
				}
				<div className='seek-button left clickable' onClick={(e) => {e.stopPropagation(); advanceBySeconds(-10)}}>
					<div className='title-container left'>
						<img className='arrow left' src= {require('../images/arrow-right.png')} />
						<div className='title'>10 secs</div>
					</div>
				</div>
			</div>
			<div className='player-center'>
				{children}
			</div>
			<div className='controls right'>
				<div
					className={['lift-button current-lifter right', liftersNextAttempt ? 'clickable' : ''].join(' ')}
					onClick={()=>attemptClick(liftersNextAttempt)}>
					{ liftersNextAttempt && 
							<div>
								<div className='title-container'>
									<div className='title'>Next Lift</div>
									<img className='arrow right' src= {require('../images/arrow-right.png')} />
								</div>
								<div className='attempt'>{liftersNextAttempt.attemptName}: {liftersNextAttempt.weight} kg</div>
							</div>
					}
				</div>
				{ nextAttempt && 
					<div
						className={['lift-button right', nextAttempt ? 'clickable' : ''].join(' ')}
						onClick={()=>attemptClick(nextAttempt)}>
							<div>
								<div className='title-container'>
									<div className='title'>Next Lifter</div>
									<img className='arrow right' src= {require('../images/arrow-right.png')} />
								</div>
								<div className='lifter-name'>{nextAttempt._lifter.shortName()}</div>
							</div>
					</div>
				}
				{editMode && 
					<div>
						<div className='seek-button right clickable' onClick={() => advanceBySeconds(30)}>30 secs &gt;&gt;</div>
						<div className='seek-button right clickable' onClick={() => advanceBySeconds(60)}>60 secs &gt;&gt;</div>	
					</div>
				}
				{showWatchMore && 
					<div className='seek-button right clickable'>
						<Link to={'/lifter/' + attemptForWatchMore._lifter._id + '?att=' + attemptForWatchMore._id}> 
							<div className='title-container'>
								<div className='title'>Watch More</div>
								<img className='arrow right' src= {require('../images/arrow-right.png')} />
							</div>
						</Link>
					</div>
				}
				<div className='seek-button right clickable' onClick={(e) => {e.stopPropagation(); advanceBySeconds(10)}}>
					<div className='title-container'>
						<div className='title'>10 secs</div>
						<img className='arrow right' src= {require('../images/arrow-right.png')} />
					</div>
				</div>
			</div>
	   	</div>
    );
}

								// <div className='attempt'>{nextAttempt.attemptName}: {nextAttempt.weight} kg</div>

								// <div className='lifter-name'>{currentAttempt._lifter.shortName()}</div>

// <div className='lifter-name'>{currentAttempt._lifter.shortName()}</div>
								// <div className='attempt'>{previousAttempt.attemptName}: {previousAttempt.weight} kg</div>

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