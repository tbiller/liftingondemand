import React, { Component } from 'react';
import { capitalize } from '../utils/general';
import { Link } from 'react-router-dom';
import Light from './Light';
import Lights from './Lights';
import CurrentAttempt from './CurrentAttempt';

export default function({ 
	currentAttempt,
	selectLiftAttempt,
	activeWeightClass,
	activeDivision,
	weightClassSuffix,
	starAttempt,
	showCompetitionName
}) {

	let DOM;

	if (currentAttempt) {
		const currentLifterAppearance = currentAttempt._appearance;
		const nextAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, 1);
		const prevAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, -1);
		

		DOM = (
			<div className='currentLifterInfo'>
				{ showCompetitionName ? 
					<Link to={'/comp/' + currentAttempt._appearance._competition.name}>
				    	<div className='current-competition-name'>{currentAttempt._appearance._competition.name}</div>
				    </Link>
				: 
					<Link to={'/lifter/' + currentAttempt._lifter._id}>
				    	<div className='current-lifter-name'>{currentAttempt._lifter.name}</div>
				    </Link>
				}
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
					<CurrentAttempt attempt={currentAttempt} />
				    
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
			   	<div className='attempt-stars'>
			    	{+currentAttempt.numStars > 1 &&
			    		<span>{currentAttempt.numStars} Stars</span>
			    	} 
			    	{+currentAttempt.numStars == 1 &&
			    		<span>{currentAttempt.numStars} Star</span>
			    	} 
			    	<div class='button' onClick={starAttempt}>Star Lift</div>
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