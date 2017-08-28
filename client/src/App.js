import React, { Component } from 'react';
import Menubar from './components/Menubar';
import Header from './components/Header';
import CompetitionRoute from './components/CompetitionRoute';
import LifterRoute from './components/LifterRoute';
import { withRouter, Switch, Redirect } from 'react-router';
import { Route } from 'react-router-dom';

import './styles/styles.css';


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
			    	menuIsOpen={this.state.menuOpen}
			    	lifters={this.state.lifters}
			    	competitions={this.state.competitions}
			    />
				<div className='content' onClick={this.contentClick}>
					<Switch>
						<Route exact path='/comp/:competitionName' render={(props)=> {
							return <CompetitionRoute competitions={this.state.competitions} sendData={this.getData} {...props} />;
						}} /> 
						<Route exact path='/lifter/:lifterId' render={(props)=> {
							return <LifterRoute {...props} sendData={this.getData}/>;
						}} /> 
						<Redirect to='/comp/IPF Classic Worlds 2017' />
					</Switch>
				</div>
		  	</div>
		);
	}
}


export default App;


  // <Route exact path='/' render={() =>
			    // 	<erect to='/competition/IPF_Classic_Worlds_2017' />
			    // }/>