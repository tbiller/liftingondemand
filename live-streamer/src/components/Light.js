import React, { Component } from 'react';

export default function({ 
	light,
	className,
	showReasonsOnly
}) {

	return (
		<div className={'lightAndReasonContainer ' + className}>
		   	{ !showReasonsOnly &&
				<div className={'light ' + [light.light, className].join(' ')} />
			}
		   	<div className={'lightReason ' + [light.reason || 'white', className].join(' ')} />
		</div>
    );
}