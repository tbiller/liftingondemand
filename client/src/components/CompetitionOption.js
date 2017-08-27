import React from 'react';
import { Link } from 'react-router-dom';

export default function({competition, isActive}) {
	return (
		<Link to={'/comp/' + competition.name}>
			<div className={['competition', isActive ? 'active' : ''].join(' ')}>
				<div>
					<div className='name'>{competition.name}</div>
					<div className='date'>{competition.dates}</div>
				</div>
				{isActive &&
					<div className={['circle-indicator', isActive ? 'active' : ''].join(' ')} />
				}
			</div>
		</Link>
	)
}