import React, { Component } from 'react';
import { capitalize } from '../utils/general';
import Light from './Light';
import Lights from './Lights';

export default function({ 
	currentAttempt,
	selectLiftAttempt,
	activeWeightClass,
	activeDivision,
	weightClassSuffix
}) {

	let DOM;

	if (currentAttempt) {
		const LBS_IN_KILO = 2.20462;
		// const c = currentLifter.attempts[currentAttemptName];
		const currentLifterAppearance = currentAttempt._appearance;
		const nextAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, 1);
		const prevAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, -1);

		// console.log(currentLiftAttempt);

		const hasLights = currentAttempt ? !!currentAttempt.lights : false;
		const weight = currentAttempt ? currentAttempt.weight : '';
		const weightInPounds = weight ? weight * LBS_IN_KILO : '';

		const kgWeightString = weight ? weight + ' kg' : '';
		const lbWeightString = weight ? Math.round(weightInPounds * 10) / 10 + ' lb' : '';

		DOM = (
			<div className='currentLifterInfo'>
			    <div className='current-lifter-name'>{currentAttempt._lifter.name}</div>
				<div className='current-attempts'>
				    {prevAttempt ?
						<div 
							onClick={() => {
								if(!prevAttempt) return;
								selectLiftAttempt({attempt: prevAttempt});
							}}
							className='previous-attempt'>
							<div className='arrow'>&lt;&lt;</div>
						</div>
					:
						<div className='arrow inactive'>&lt;&lt;</div>

					}
				    <div className='current-attempt'>
					    <div className='current-attempt-name'>{currentAttempt.attemptName}</div>
					    <div className='current-weight'>
					    	{kgWeightString} ({lbWeightString})
					    
				        </div>
				        { hasLights && 
				        	<Lights lights={currentAttempt.lights} className='round' />
						}
					</div>
					{nextAttempt ?
						<div 
							onClick={() => {
								if(!nextAttempt) return;
								selectLiftAttempt({attempt: nextAttempt});
							}}
							className='next-attempt'>
							<div className='arrow'>&gt;&gt;</div>
						</div>
					:
						<div className='arrow inactive'>&gt;&gt;</div>
					}
				</div>
		   	</div>
		);
	} else {
		DOM = (
			<div className='currentLifterInfo'>
				{ activeWeightClass && 
					<div className='current-lifter-name'>{activeWeightClass + ' ' + weightClassSuffix + ' - ' + capitalize(activeDivision)}</div>
				}

			</div>
		);
	}

	return DOM;
}


							// <img className='arrow' src= {require('../images/arrow-down.png')} />

	// <div className='kg-weight'>{kgWeightString}</div>
	// 		    	<div className='lb-weight'>{lbWeightString}</div>