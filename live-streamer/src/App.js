import React, { Component } from 'react';
import Menubar from './components/Menubar';
import Header from './components/Header';
import Competition from './components/Competition';
import { withRouter, Switch, Redirect } from 'react-router';
import { Route } from 'react-router-dom';

import './styles/styles.css';

const CompetitionRoute = ({path, ...compProps}) => {
	return <Route
				path={path}
				render={(props) => <Competition {...props} {...compProps} />}
				/>;
}


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeCompetitionId: '',
			menuOpen: false,
			competitions: [],
			lifters: [],
			loadingCompetitions: true,
			loadingLifters: true,
		};
	}

	componentDidMount =() => {
		console.log(this.props);
		fetch('/competitions')
			.then(res => res.json())
			.then(json => {
				this.setState({
					competitions: json, 
					loadingCompetitions: false
				});
				// if (!this.state.competition_id) {
				// 	this.competitionClick(json[0]);
				// }
			});
		fetch('/lifters')
			.then(res => res.json())
			.then(json => {
				this.setState({
					lifters: json, 
					loadingLifters: false
				})
			});
	}

	// componentDidUpdate() {
	// 	this.updateActiveCompetition();
	// }
	
	toggleMenu = (boolOpen) => {
		let open = false;
		if (boolOpen !== undefined) {
			open = boolOpen;
		} else {
			open = !this.state.menuOpen;
		}
		this.setState({menuOpen: open});
	}
	
	closeMenu = () => {
		this.toggleMenu(false);
	}

	contentClick = (e) => {
		if (this.state.menuOpen) {
			this.closeMenu();
			e.stopPropagation();
		}
	}

	competitionClick = (competition) => {
		if (competition.name === this.state.competitionName) return false;
		this.setState({
			activeCompetition: competition, 
			competitionName: competition.name
		});
		this.props.history.push('/comp/' + competition.name);
		window.setTimeout(this.closeMenu, 400);
	}

	// updateActiveCompetition = () => {
	// 	if (!this.state.competitionName) return false;
	// 	if (!this.state.competitions) return false;
	// 	if (this.state.activeCompetition && this.state.activeCompetition.name === this.state.competitionName) {
	// 		return this.state.activeCompetition;
	// 	}		

	// 	for (let i = 0; i < this.state.competitions.length; i++) {
	// 		let competition = this.state.competitions[i];
	// 		if (competition.name === this.state.competitionName) {
	// 			this.setState({
	// 				activeCompetition: competition,
	// 				competitionName: competition.name
	// 			});
	// 		}
	// 	}
	// 	return false;
	// }

	getData = (data) => {
		this.setState(data);
	}

	render() {
		return (
			<div className='app'>
				<Menubar 
					isOpen={this.state.menuOpen} 
					closeMenu={this.closeMenu} 
					competitions={this.state.competitions}
					activeCompetitionId={this.state.activeCompetitionId}
				/>
				<Header 
			    	menuClick={this.toggleMenu} 
			    	optionsClick={this.toggleOptions} 
			    	// activeCompetition={this.state.activeCompetition}
			    	// weightClass={this.state.weightClass}
			    	// division={this.state.division}
			    	// optionsIsOpen={this.state.optionsShown}
			    	menuIsOpen={this.state.menuOpen}
			    	lifters={this.state.lifters}
			    	competitions={this.state.competitions}
			    	// competitionClick={this.competitionClick}
			    	// lifterClick={this.lifterClick}
			    />

			  

				<div className='content' onClick={this.contentClick}>
					<Route path='/comp/:competitionName' render={(props)=> {
						return <Competition competitions={this.state.competitions} sendData={this.getData} {...props} />;
					}} /> 
				</div>
		  	</div>
		);
	}
}


export default withRouter(App);


  // <Route exact path='/' render={() =>
			    // 	<Redirect to='/competition/IPF_Classic_Worlds_2017' />
			    // }/>