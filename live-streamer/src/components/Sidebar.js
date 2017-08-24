import React, { Component } from 'react';

export default function({isOpen, children, close, style}) {

	return (
		<div onClick={close} className={['side-bar', style, isOpen ? 'open' : ''].join(' ')}>
			{children}
		</div>
	)
}

		    		
 