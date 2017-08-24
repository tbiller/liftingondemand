import React, { Component } from 'react';
import Light from './Light';

export default function({ 
	lights,
	className,
	showReasonsOnly
}) {
	const lightComponents = () => {
		const lightComponents = [];
		if (lights) {
			for (let i = 0; i < 3; i++) {
				lightComponents.push(
					<Light key={i} showReasonsOnly={showReasonsOnly} className={className} 
						light={lights[i]}
					/>
				);
			}
		}
		
		return lightComponents;
	}

	return (
		<div className={'lights ' + className}>
			{lightComponents()}
		</div>
	);
}