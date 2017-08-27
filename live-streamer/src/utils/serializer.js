import { withRouter } from 'react-router';
import queryString from 'query-string';

const serializeParams = (params) => {
	const serializedParams = {};
	for (let key in params) {
		let newKey = key;
		let newVal = params[key];
		switch (key) {
			case 'attempt':
				newKey = 'att';
				newVal = params[key] ? params[key].split(' ').join('_') : null;
				break;
			case 'weightClass':
				newKey = 'wc';
				break;
			case 'lifter':
				newVal = params[key] ? params[key].split(' ').join('_') : null;
				break;
			case 'division':
				newKey = 'div';
				break;
		}
		serializedParams[newKey] = newVal;
	}
	return serializedParams;
}

const deserializeParams = (params) => {
	const deserializedParams = {};
	for (let key in params) {
		let newKey = key;
		let newVal = params[key];
		switch (key) {
			case 'att':
				newKey = 'attempt';
				newVal = params[key] ? params[key].split('_').join(' ') : null;
				break;
			case 'wc':
				newKey = 'weightClass';
				break;
			case 'lifter':
				newVal = params[key] ? params[key].split('_').join(' ') : null;
				break;
			case 'div':
				newKey = 'division';
				break;
		}
		deserializedParams[newKey] = newVal;
	}
	return deserializedParams;
}

const updateUrlParams = (history, location, newParams, addToHistory=true) => {
	const serializedParams = serializeParams(newParams);
	const params = queryString.parse(location.search);
	const combinedParams = Object.assign({}, params, serializedParams);

	if (addToHistory) {
		history.push({search: '?' + queryString.stringify(combinedParams)});
	} else {
		history.replace({search: '?' + queryString.stringify(combinedParams)});
	}
}

const navigateTo = (history, pathname, params, addToHistory=true) => {
	const search = params ? '?' + queryString.stringify(params) : '';
	if (addToHistory) {
		history.push(pathname, search);
	} else {
		history.push(pathname, search);
	}
}


export default { serializeParams, deserializeParams, updateUrlParams, navigateTo };