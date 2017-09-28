import React from 'react';
import '../styles/components/ShareIcon.css';

export default function({attempt}) {

	function handleClick() {
		let link;

		// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		//     link = 'localhost:3000/';
		// } else {
			link = 'https://www.liftingondemand.com/';
		// }

		if (attempt && attempt._lifter) {
			link += 'lifter/' + attempt._lifter._id + '?att=' + attempt._id;
		}


		window.FB.ui(
		 {
		  method: 'share',
		  href: 'https://www.liftingondemand.com'
		}, function(response){});
	}
	return (
		<img onClick={handleClick} className='share-arrow' src= {require('../images/share-arrow.png')} />
	);	
}
