import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
	<BrowserRouter>
		<ScrollToTop>
			<Route component={App} />
		</ScrollToTop>
	</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();

