import React, { Component } from 'react';
import { capitalize } from '../utils/general';
import { Link } from 'react-router-dom';
import Light from './Light';
import Lights from './Lights';
import AttemptStars from './AttemptStars';
import CurrentAttempt from './CurrentAttempt';

export default function({ 
	currentAttempt,
	selectLiftAttempt,
	activeWeightClass,
	activeDivision,
	weightClassSuffix,
	starAttempt,
	starredAttempts,
	showCompetitionName
}) {

	let DOM;

	if (currentAttempt) {
		const currentLifterAppearance = currentAttempt._appearance;
		const nextAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, 1);
		const prevAttempt = currentLifterAppearance.nextAttemptWithFrameData(currentAttempt.attemptName, -1);

		DOM = (
			<div className='currentLifterInfo'>
				<div className='attempt-name'>
					{currentAttempt.longName()}
				</div>
				<div className='center-container'>
					{ showCompetitionName ? 
						<Link to={'/comp/' + currentAttempt._appearance._competition.name}>
					    	<div className='current-competition-name'>{currentAttempt._appearance._competition.name}</div>
					    </Link>
					: 
						<Link to={'/lifter/' + currentAttempt._lifter._id}>
					    	<div className='current-lifter-name'>{currentAttempt._lifter.name}</div>
					    </Link>
					}
					<CurrentAttempt attempt={currentAttempt} />
				</div>
				<AttemptStars 
					attempt={currentAttempt} 
					starAttempt={starAttempt} 
					starredAttempts={starredAttempts} 
				/>
		   	
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



// {prevAttempt ?
// 						<div 
// 							onClick={() => {
// 								if(!prevAttempt) return;
// 								selectLiftAttempt({attempt: prevAttempt});
// 							}}
// 							className='previous-attempt'>
// 							<div className='arrow'>&lt;&lt;</div>
// 						</div>
// 					:
// 						<div className='arrow inactive'>&lt;&lt;</div>

// 					}
// {nextAttempt ?
// 						<div 
// 							onClick={() => {
// 								if(!nextAttempt) return;
// 								selectLiftAttempt({attempt: nextAttempt});
// 							}}
// 							className='next-attempt'>
// 							<div className='arrow'>&gt;&gt;</div>
// 						</div>
// 					:
// 						<div className='arrow inactive'>&gt;&gt;</div>
// 					}
							// <img className='arrow' src= {require('../images/arrow-down.png')} />

	// <div className='kg-weight'>{kgWeightString}</div>
	// 		    	<div className='lb-weight'>{lbWeightString}</div>