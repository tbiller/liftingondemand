import React from 'react';
import '../styles/components/Footer.css';

export default function() {
	return (
		<div className='footer'>
			<div>&copy; 2017 Trevor Biller. All rights reserved.</div>
			<div>Videos &copy; <a target='_blank' href='http://www.powerlifting-ipf.com/'>IPF</a>, 
				&nbsp;<a target='_blank' href='http://www.usapowerlifting.com/'>USAPL</a>, or their respective owners.
			</div>
		</div>
	);
}