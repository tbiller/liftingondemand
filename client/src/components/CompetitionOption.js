import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/CompetitionOption.css';

export default function({competition, isActive}) {
	return (
		<div className={['competition-option', isActive ? 'active' : ''].join(' ')}>
			<Link to={'/comp/' + competition.name}>
				<div>
					<div className='name'>{competition.name}</div>
					<div className='date'>{competition.dates}</div>
				</div>
				{isActive &&
					<div className={['circle-indicator', isActive ? 'active' : ''].join(' ')} />
				}
			</Link>
		</div>
	)
}