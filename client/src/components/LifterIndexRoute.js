import React, { Component } from 'react';
import CompetitionOption from './CompetitionOption';
import Searchbox from './Searchbox';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
import '../styles/components/LifterIndexRoute.css';

class LifterIndexRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			matchingLifters: []
		}
		this.maxItems = 100;
	}

	updateMatches = (matches) => {
		this.setState({matchingLifters: matches});
	}

	results = () => {
		const els = [], { matchingLifters } = this.state;
		for (let i = 0; i < Math.min(this.maxItems, matchingLifters.length); i++) {
			const match = matchingLifters[i];
			const { name } = match;
			els.push(
				<Link to={'/lifter/' + match._id }  key={match._id}>
					<div className='item'>
						<div className='lifter-name'>{name}</div>
						<div className='aside'>
							<div className='weightClass'>{match.appearances[0].weightclassLong()}</div>
						</div>
					</div>
				</Link>
			);
			if (i + 1 >= this.maxItems) {
				els.push(
					<div key={name + 'note'} className='searchbox-note'>{matchingLifters.length - this.maxItems} additional matches</div>
				)
				break;
			}
		}
		return els;
	}

	render() {
		if (this.props.loading === true) {
			return <Spinner />;
		}

		const { lifters } = this.props;
	
		return (
			<div className='lifter-list'>
				<div className='title'>
					<span>Lifters</span>
					<Searchbox 
						allOptions={lifters} 
						minCharacters={2}
						reportMatches={this.updateMatches} 
						placeholder='Search for lifters'/>
				</div>
				<div className='searchbox-list'>
					{this.results()}
				</div>
			</div>
		);
	}
}

export default LifterIndexRoute;