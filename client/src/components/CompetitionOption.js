import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/CompetitionOption.css';

export default function({competition, isActive}) {
	return (
		<Link to={'/comp/' + competition.name}>
			<div className={['competition-option', isActive ? 'active' : ''].join(' ')}>
				<div>
					<div className='name'>{competition.name}</div>
					<div className='date'>{competition.dates}</div>
				</div>
				<div className='style'>{competition.style}</div>
				{isActive &&
					<div className={['circle-indicator', isActive ? 'active' : ''].join(' ')} />
				}
			</div>
		</Link>
	)
}