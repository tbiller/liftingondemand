import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AttemptStars from './AttemptStars';
import ShareIcon from './ShareIcon';

class AttemptCardHeader extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.attempt !== nextProps.attempt || 
			this.props.isStarred !== nextProps.isStarred;
	}

	render() {
		const { 
			attempt,
			starAttempt,
			isStarred,
			isActive
		} = this.props;
		return (
			<div className='header'>
				<div className='lifter-info'>
					<div className='lifter-name'>
						<Link to={'/lifter/' + attempt._lifter._id}>
							{attempt._lifter.name}
						</Link>
					</div>
					<div className='competition-name'>
						<Link to={'/comp/' + attempt._competition.name}>
							{attempt._competition.name}
						</Link>
					</div>
				</div>
				<div className='attempt-info'>
					<div className='attempt'>
						<div className='lift-name'>{attempt.longName()}:</div>
						<div className='kg-weight'>{attempt.kgString()}</div>
						<div className='lb-weight'>{attempt.lbString()}</div>
					</div>
					<div className='right-container'>
					 	<div className='weightclass-division'>
					 		{
							attempt._appearance.weightclassLong() + ' - ' + 
							attempt._appearance.divisionLong() }
						</div>
						{attempt.records &&
							<div className='flex-row'>
								<div className='divider'>&nbsp;</div>
								
							    <div className='records'>
							    	{attempt.recordsLong()}
							    </div>
							</div>
					    }

						<div className='divider'>&nbsp;</div>

					    <AttemptStars attempt={attempt} starAttempt={(e)=> {
							starAttempt(attempt);
							e.stopPropagation();
						}} isStarred={isStarred} />
						<div className='divider'>&nbsp;</div>
						<ShareIcon isActive={isActive} attempt={attempt}/>
					</div>
				</div>
			</div>
		);
	}
}

export default AttemptCardHeader;