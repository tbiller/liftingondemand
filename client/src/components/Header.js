import React from 'react';
import Searchbox from './Searchbox_combined';
import { Link } from 'react-router-dom';
import RouteIndicator from './RouteIndicator';
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
			<div className='burger-and-title'>
				<div onClick={menuClick} className={['burger-icon', menuIsOpen ? 'rotated': ''].join(' ')}>
					<div className='bar' />
					<div className='bar' />
					<div className='bar' />
				</div>
				<div className="app-title">
					<Link to='/'>Lifting On Demand</Link>
				</div>
			</div>
			<RouteIndicator />
			<Searchbox 
				lifters={lifters} 
				competitions={competitions}
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