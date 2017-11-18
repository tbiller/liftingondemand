import React, { Component } from 'react';

import '../styles/components/AboutRoute.css';

class AboutRoute extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='about'>
				<div className='title'>About</div>
				<div className='about-content'>
					<p>
						Lifting On Demand is the home for powerlifting competition videos.
					</p>
					<p>
						We use a computer script to help us detect when lifters are on competition livestreams. That saves us from recording all
						the timestamps by hand. Computer identification does mean that we will get it wrong from time to time.
					</p>
					<p>
						Something wrong with a timestamp or video? Contact us at 
						<span className='email-address'>support@liftingondemand.com</span>to report any errors, or if you have any other questions or ideas for the site.
					</p>
					<p>On a mobile device? Mobile browsers can be finicky, visit the site on desktop if things aren't working right.</p>
				</div>
			</div>

		);
	}
}

export default AboutRoute;