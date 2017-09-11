import React, { Component } from 'react';
import CompetitionOption from './CompetitionOption';
import '../styles/components/CompetitionIndexRoute.css';

class CompetitionIndexRoute extends Component {
	render() {
		const { competitions } = this.props;
		const competitionOptions = [];
		if (competitions.length) {
			competitions.sort((a,b) => {
				return new Date(b.dateForSorting) -  new Date(a.dateForSorting);
			})
			competitions.forEach((competition) => {
				competitionOptions.push(
					<CompetitionOption key={competition._id} competition={competition} isActive={false} />
				);
			});
		}

		return (

			<div className='competition-list'>
				<div className='title'>Competitions</div>
				{competitionOptions}
			</div>
		);
	}
}

export default CompetitionIndexRoute;