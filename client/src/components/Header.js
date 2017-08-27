import React from 'react';
import Searchbox from './Searchbox';
export default function({
	// activeCompetition, 
	menuClick, 
	// optionsClick, 
	// optionsIsOpen, 
	// weightClass, 
	// division, 
	menuIsOpen,
	competitions,
	lifters,
	lifterClick,
	competitionClick
	}) {

	return (
		<div className='header'>
			<div onClick={menuClick} className={['burger-icon', menuIsOpen ? 'rotated': ''].join(' ')}>
				<div className='bar' />
				<div className='bar' />
				<div className='bar' />
			</div>
			<div onClick={menuClick} className="app-title">
				Lifting On Demand
			</div>
			<Searchbox 
				lifters={lifters} 
				competitions={competitions}
				// lifterClick={lifterClick}
				// competitionClick={competitionClick}
			/>
			
		</div>
	);
}


// {weightClass && 
// 				<div onClick={optionsClick} className='active-division'>
// 					{weightClass + 'kg  ' + capitalize(division)}
// 					<img className={['arrow', optionsIsOpen ? 'rotated' : ''].join(' ')} src= {require('../images/arrow-down.png')} />
// 				</div>
// 			}