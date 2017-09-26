import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import '../styles/components/RouteIndicator.css';

export default withRouter(function({location}) {
	const routes = [
		['Best Lifts', '', ''], 
		['Competitions', 'comp', 'competitions'],
		['Lifters', 'lifter', 'lifters'],
		['About', 'about', 'about']
	];
	//console.log(location);
	const routeOptions = [];
	const path = location.pathname.split('/')[1].toLowerCase();
	routes.forEach((route) => {
		const isActive = path === route[1].toLowerCase() || path === route[2].toLowerCase();
		routeOptions.push(
			<div key={route[0]} className={['route-option', isActive ? 'active' : ''].join(' ')}>
				<Link to={'/' + route[2]}>
					{route[0]}
				</Link>
			</div>
		);
	})
	return (
		<div className='route-indicator'>
			{routeOptions}
		</div>
	);
});

