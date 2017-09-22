import React from 'react';
import '../styles/components/Spinner.css';

export default function() {
	return (
		<div className='spinner'>
			<div className="cssload-wrap">
				<div className="cssload-container">
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
					<span className="cssload-dots"></span>
				</div>
			</div>
			<div className='label'>Loading...</div>
		</div>
	)
}