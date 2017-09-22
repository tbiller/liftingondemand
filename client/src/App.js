import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Menubar from './components/Menubar';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardRoute from './components/DashboardRoute';
import CompetitionIndexRoute from './components/CompetitionIndexRoute';
import CompetitionRoute from './components/CompetitionRoute';
import LifterRoute from './components/LifterRoute';
import LifterIndexRoute from './components/LifterIndexRoute';
import AboutRoute from './components/AboutRoute';
import Lifter from './models/Lifter';
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
			// activeCompetitionId: '',
			menuOpen: false,
			competitions: [],
			lifters: [],
			loadingCompetitions: false,
			loadingLifters: false,
			userCookie: cookies,
			starredAttempts: cookies.get('starredAttempts')
		};
	}

	componentDidMount = () => {
		// this.app = ReactDOM.findDOMNode(this.refs.content);
		window.addEventListener('scroll', this.handleScroll);
		this.setState({loadingCompetitions: true, loadingLifters: true});
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
				const lifters = [];
				json.forEach((lifterJson) => {
					lifters.push(new Lifter(lifterJson));
				});
				this.setState({
					lifters: lifters, 
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

	// contentClick = (e) => {
	// 	// if (this.state.menuOpen) {
	// 	// 	this.closeMenu();
	// 	// 	e.stopPropagation();
	// 	// }
	// }

	getData = (data) => {
		this.setState(data);
	}

	starAttempt = (attempt) => {
		console.log('in starAttempt');
		const { cookies } = this.props;
		const starredAttempts = cookies.get('starredAttempts');
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
			newStarredAttempts = starredAttempts.concat([attempt._id]);
		}
		console.log('newStarredAttempts', newStarredAttempts);

		cookies.set('starredAttempts', newStarredAttempts, { path: '/' });
		this.setState({'starredAttempts': newStarredAttempts});
		fetch('/attempt/' +  attempt._id + '/' + action, { method: 'POST' });
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
				<div className='header-and-content'>
					<Header 
				    	menuClick={this.toggleMenu} 
				    	optionsClick={this.toggleOptions} 
				    	menuIsOpen={this.state.menuOpen}
				    	lifters={this.state.lifters}
				    	competitions={this.state.competitions}
				    />
					<div className='content'>
						<Switch>
							<Route exact path='/competitions' render={(props)=> {
								return <CompetitionIndexRoute competitions={this.state.competitions} 
									loading={this.state.loadingCompetitions} {...props} />;
							}} /> 
							<Route exact path='/lifters' render={(props)=> {
								return <LifterIndexRoute lifters={this.state.lifters} 
									loading={this.state.loadingLifters} {...props} />;
							}} /> 
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
									starAttempt={this.starAttempt} 
									starredAttempts={this.state.starredAttempts}/>;
							}} /> 
							<Route exact path='/about' render={(props)=> {
								return <AboutRoute {...props} />
							}} /> 
							<Route exact path='/' render={(props)=> {
								return <DashboardRoute {...props} 
									starAttempt={this.starAttempt} 
									starredAttempts={this.state.starredAttempts}/>;
							}} />
							<Redirect to='/' />
						</Switch>
					</div>
					<Footer />
				</div>
		  	</div>
		);
	}
}


export default withCookies(App);

