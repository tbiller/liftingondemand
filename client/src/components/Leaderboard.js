import React, { Component } from 'react';
import ResultsTable from './ResultsTable';
import Option from './Option';

export default function({
	player,
	leaderboardType, 
	optionClick,
	results,
	currentAttempt,
	liftsInOrder,
	autoPlayingLifters,
	clearAutoPlayingLifters,
	autoPlayTopLifters,
	...tableProps 
}) {
	// if (currentLifter) {
	// 	var currentAttempt = currentLifter.lifts[currentAttemptName];
	// 	// var currentAttemptIdx = liftsInOrder.indexOf(currentAttemptName);
	// 	// var currentLiftWeight = currentLifter.lifts[currentAttemptName].weight;
	// 	// var currentLifterLot = currentLifter.lot;
	// 	// var currentLifterFlight = currentLifter.flight;
	// }

	if (currentAttempt) {
		var currentAttemptName = currentAttempt.attemptName;
	}


	function shouldShowResult(attempt) {
		if (leaderboardType === 'final') {
			return true;
		} else if (leaderboardType === 'live') {
			return attempt.hasBeenSubmittedAsOf(currentAttempt);
		} else {
			console.warn('leaderboardType not recognized');
			return true;
		}
		
	}

	function weightToRankBy(lifterAppearance) {
		// if lifter has not completed current lift, rank based on current lift
		// if lifter has already completed curent lift, rank based on next lift
		const attemptName =  currentAttemptName || 'Squat 1';
		const liftAttempt = lifterAppearance.attempts[attemptName];
		const currentAttemptIdx = liftAttempt.attemptIdx();

		const lifterHasCompletedCurrentLift = currentAttempt ? 
			liftAttempt.hasOccurredAsOf(currentAttempt, true) :
			false;

		if (!lifterHasCompletedCurrentLift) {
			if (isNaN(+liftAttempt.weight)) {
				return 10000;
			}
			return +liftAttempt.weight;
		} else {
			// rank in front current lifters who have not yet completed lifting, 
			// then by next liftweight
			let weightToReturn = 0;
			const offset = -10000;
			if (currentAttemptIdx < liftsInOrder.length - 1) {
				weightToReturn = +lifterAppearance.attempts[liftsInOrder[currentAttemptIdx + 1]].weight;
			} else {
				// last lift - order by last lift
				weightToReturn = lifterAppearance.attempts[liftsInOrder[currentAttemptIdx]].weight;
			}

			if (isNaN(weightToReturn)) {
				weightToReturn = 5000;
			}

			return offset + weightToReturn;
		}
	}


	function sortLifters(appearanceA, appearanceB) {
		if (appearanceA.flight > appearanceB.flight) return 1;
		if (appearanceA.flight < appearanceB.flight) return -1;

		let appearanceAWeightToRankBy = weightToRankBy(appearanceA);
		let appearanceBWeightToRankBy = weightToRankBy(appearanceB);
		const weightDiff = appearanceAWeightToRankBy - appearanceBWeightToRankBy;

		if (weightDiff < 0) { return -1; }
		if (weightDiff > 0) { return 1; }

		return  +appearanceA.lot - +appearanceB.lot;
	}

	function sortResultStrings(a, b) {
		if (isNaN(parseFloat(a, 10))) return 1;
		if (isNaN(parseFloat(b, 10))) return -1;
		return parseFloat(a) - parseFloat(b);
	}

	function orderedResults() {
		//console.log('resorting');

		const unorderedResults = [];
		for (let lifterName in results) {
			if (results.hasOwnProperty(lifterName)) {
				unorderedResults.push(results[lifterName]);
			}
		}

		if (leaderboardType === 'live') {
			return unorderedResults.sort((lifterA, lifterB) => {
				return sortLifters(lifterA, lifterB);
			});
		} else {
			return unorderedResults.sort((lifterA, lifterB) => {
				return sortResultStrings(lifterA.place, lifterB.place)
			});
		}
	}

	return (
		<div className='leaderboard'>
			<div className='leaderboard-header'>
				<div className='leaderboard-title'>Leaderboard</div>
				
				
				<div className='options'>
					<Option value='final' displayValue='Final Results' optType='leaderboardType' activeValue={leaderboardType} optionClick={optionClick}/>
					<Option value='live' displayValue='In the Moment' optType='leaderboardType' activeValue={leaderboardType} optionClick={optionClick}/>
				</div>
			</div>
			<ResultsTable {...tableProps} 
				shouldShowResult={shouldShowResult} 
				currentAttempt={currentAttempt}
				leaderboardType={leaderboardType}
				autoPlayingLifters={autoPlayingLifters}
				results={orderedResults()}
			/>
		</div>
	);
}




			// className={['leaderboard-type', leaderboardType === 'final' ? 'active' : ''].join(' ')}>Final Results</div>
			// <d<div onClick=iv className={['leaderboard-type', leaderboardType === 'live' ? 'active' : ''].join(' ')}>In the Moment</div>
// <div className='autoplay-buttons'>
// 					<div className='button watch-top-three' onClick={() => autoPlayTopLifters(3)}>Watch Top 3</div>
// 					{autoPlayingLifters.length > 0 &&
// 						<div className='button clear-autoplay' onClick={clearAutoPlayingLifters}>Stop Autoplaying</div>
// 					}
// 				</div>

// <div className='legend'>
// 					<span className='title'></span>
// 					<div className='legend-entries'>
// 						<span className='good-lift'>Good Lift</span>
// 						<span className='no-lift'>No Lift</span>
// 						<span className='no-frame'>No Data</span>
// 					</div>
// 				</div>