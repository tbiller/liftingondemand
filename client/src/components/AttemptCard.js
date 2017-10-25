import React, { Component } from 'react';
import AttemptCardHeader from './AttemptCardHeader';
import AttemptCardPlayer from './AttemptCardPlayer';
import deepEqual from 'deep-equal';
import '../styles/components/AttemptCard.css';

class AttemptCard extends Component {
	

	
	render() {
		const { cardRef,
		attempt,
		starAttempt,
		isStarred,
		isActive,
		onClick } = this.props;
		if (!attempt) return null;
		//console.log('renderinrg attempt card');
		return (
			<div ref={cardRef} className={['attempt-card', isActive ? 'active' : ''].join(' ')} onClick={onClick}>
				<AttemptCardHeader 
					attempt={attempt}
					starAttempt={starAttempt}
					isStarred={isStarred}
					isActive={isActive}
					/>
				<AttemptCardPlayer
					attempt={attempt}
					isActive={isActive}
					/>
			</div>
		);
	}
}

export default AttemptCard;
