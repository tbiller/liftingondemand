import React, { Component } from 'react';
import Sidebar from './Sidebar';
import CompetitionOption from './CompetitionOption';

function MenuBar({isOpen, closeMenu, competitions, activeCompetitionId}) {
	const competitionOptions = [];
	if (competitions.length) {
		competitions.sort((a,b) => {
			return new Date(b.dateForSorting) -  new Date(a.dateForSorting);
		})
		competitions.forEach((competition) => {
			const isActive = competition._id === activeCompetitionId;
			competitionOptions.push(
				<CompetitionOption key={competition._id} competition={competition} isActive={isActive} />
			);
		});
	}
	

	return (
		<div onClick={closeMenu} className={['side-bar', 'left', isOpen ? 'open' : ''].join(' ')}>
			<div className='app-title'>Lifting On Demand</div>
			<div className='divider' />
			<div className='section'>
				<div className='section-title'>Competitions</div>
				<div>
					{competitionOptions}
				</div>
			</div>
			<div className='section'>
				<div className='section-title'>Blog</div>
				<div>
					<div className='blog inactive'>No posts available</div>
				</div>
			</div>
			<div className='section about'>
				<div className='section-title'>About</div>
				<div className='section-content'>A new way to watch powerlifting livestreams, taking advantage of automatic video analysis.</div>
			</div>
			<div className='divider' />
			<div className='footer'>
				<div>Trevor Biller</div>
				<div>All Videos Copyright <a target='_blank' href='http://www.powerlifting-ipf.com/'>IPF</a></div>
			</div>
		</div>	
	);
}

export default MenuBar;