import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route } from 'react-router';
import { Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ScrollToTop from './components/ScrollToTop';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory();
const initGA = (history) => {

   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    window.ga('create', 'UA-98470390-2', 'auto');
    window.ga('send', 'pageview');

    console.log('initting');

	history.listen((location) => {
		console.log("tracking page view: " + location.pathname);
		window.ga('send', 'pageview', location.pathname);
	});
};

initGA(history);

ReactDOM.render((
	<Router history={history}>
		<CookiesProvider>
			<ScrollToTop>
				<Route component={App} />
			</ScrollToTop>
		</CookiesProvider>
	</Router>
), document.getElementById('root'));

registerServiceWorker();


