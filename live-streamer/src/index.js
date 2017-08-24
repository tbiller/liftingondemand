import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
	<BrowserRouter>
		<Route component={App} />
	</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();

