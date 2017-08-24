import React, { Component } from 'react';

export default function({optType, value, displayValue, activeValue, optionClick}) {
	const isActive = () => {
		return ('' + activeValue).toLowerCase() === ('' + value).toLowerCase();
	}

	if (!displayValue) {
		displayValue = value;
	}
	return (
		<div 
			key={value}
			className={ 
				['option', optType, isActive() ? 'active' : ''].join(' ') 
			}
			onClick={(e) => {
				e.stopPropagation(); 
				optionClick(optType, value);
			}}>
			{displayValue}
		</div>
	);
}