import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ScrollToTop from './components/ScrollToTop';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
	<BrowserRouter>
		<CookiesProvider>
			<ScrollToTop>
				<Route component={App} />
			</ScrollToTop>
		</CookiesProvider>
	</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();

