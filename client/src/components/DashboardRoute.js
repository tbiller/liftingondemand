import React, { Component } from 'react';
import TopAttempts from './TopAttempts';
import AttemptOptions from './AttemptOptions';
import AttemptList from './AttemptList';
import queryString from 'query-string';
import deepEqual from 'deep-equal';
import Attempt from '../models/Attempt';
import '../styles/components/DashboardRoute.css';

class DashboardRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filters: {
				sortBy: 'weight',
				lift: 'Squat',
				style: 'Raw'
			},
			topAttempts: [],
			loading: false
		};
	}

	componentDidMount() {
		this.fetchNewData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (!deepEqual(prevState.filters, this.state.filters)) {
			//console.log('fetching new data');
			this.fetchNewData();
		}
	}


	fetchNewData() {
		this.setState({loading: true});
		const filters = this.state.filters;

		fetch('/api/attempts/top?' + queryString.stringify(this.state.filters))
			.then(res => res.json())
			.then(json => {
				// make sure this is for the most recent request
				if (!deepEqual(this.state.filters, filters)) return;

				const attempts = [];
				if (json) {
					json.forEach((attemptJson) => {
						attempts.push(new Attempt(attemptJson));
					});
				}
				this.setState({topAttempts: attempts, loading: false})
			});
	}

	optionChange = (optType, val) => {
		const newFilters = Object.assign({}, this.state.filters);
		newFilters[optType] = val;
		this.setState({filters: newFilters});
	}

	render() {
		return (
			<div className='attempts'>
				<AttemptOptions 
					optionChange={this.optionChange} 
					filters={this.state.filters}/>
				<AttemptList 
					attempts={this.state.topAttempts}
					starredAttempts={this.props.starredAttempts}
					starAttempt={this.props.starAttempt}
					loading={this.state.loading}/>
			</div>
		)
	}
}

export default DashboardRoute;