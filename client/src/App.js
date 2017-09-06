import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Menubar from './components/Menubar';
import Header from './components/Header';
import DashboardRoute from './components/DashboardRoute';
import CompetitionRoute from './components/CompetitionRoute';
import LifterRoute from './components/LifterRoute';
import { withRouter, Switch, Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import './styles/styles.css';


class App extends Component {
	constructor(props) {
		super(props);
		const { cookies } = this.props;
		if (!cookies.get('starredAttempts')) {
			cookies.set('starredAttempts', [], {path: '/'});
		}

		this.state = {
			activeCompetitionId: '',
			menuOpen: false,
			competitions: [],
			lifters: [],
			loadingCompetitions: true,
			loadingLifters: true,
			userCookie: cookies
		};
	}

	componentDidMount = () => {
		// this.app = ReactDOM.findDOMNode(this.refs.content);
		window.addEventListener('scroll', this.handleScroll);

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

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
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

	starAttempt = (attempt) => {
		console.log('in starAttempt');
		const { cookies } = this.props;
		const starredAttempts = cookies.get('starredAttempts');
		console.log(starredAttempts);
		let newStarredAttempts = [];
		let action = '';
		const idx = starredAttempts.indexOf(attempt._id);
		
		if (idx !== -1) {
			console.log('unstarring');
			action = 'unstar';
			attempt.numStars -= 1;
			if (attempt.numStars < 0) attempt.numStars = 0;
			newStarredAttempts = starredAttempts.slice();
			newStarredAttempts.splice(idx, 1);
			console.log(starredAttempts);
		} else {
			action = 'star'
			attempt.numStars += 1;
			newStarredAttempts = starredAttempts.concat(attempt._id);
		}

		cookies.set('starredAttempts', newStarredAttempts, { path: '/' });
		this.setState({'starredAttempts': newStarredAttempts});
		fetch('/attempt/' +  attempt._id + '/' + action, { method: 'POST' });
	}

	render() {
		return (
			<div className='app' >
				<Menubar 
					isOpen={this.state.menuOpen} 
					closeMenu={this.closeMenu} 
					competitions={this.state.competitions}
					activeCompetitionId={this.state.activeCompetitionId}
				/>
				<div className='header-and-content'>
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
								return <CompetitionRoute competitions={this.state.competitions} 
									sendData={this.getData} 
									cookies={this.cookies}
									starAttempt={this.starAttempt}
									starredAttempts={this.state.starredAttempts}
									{...props} />;
							}} /> 
							<Route exact path='/lifter/:lifterId' render={(props)=> {
								return <LifterRoute {...props} 
									sendData={this.getData}
									starAttempt={this.starAttempt} 
									starredAttempts={this.state.starredAttempts}/>;
							}} /> 
							<Route exact path='/' component={DashboardRoute} />
							<Redirect to='/' />
						</Switch>
					</div>
				</div>
		  	</div>
		);
	}
}


export default withCookies(App);


  // <Route exact path='/' render={() =>
			    // 	<erect to='/competition/IPF_Classic_Worlds_2017' />
			    // }/>