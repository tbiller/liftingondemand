import React, { Component } from 'react';
import ReactModal from 'react-modal';
import Clipboard from 'clipboard';
import '../styles/components/ShareIcon.css';

class ShareIcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isActive: true,// props.isActive,
			showModal: false,
			copyStatus: 'Copy link'
		}
	}

	componentDidUpdate() {
		if (this.state.isActive && this.state.showModal) {
			this.clipboard = new Clipboard('.copy-to-clipboard')
			this.clipboard.on('success', (e) => {
				console.log('copied!');
				this.setState({copyStatus: 'Copied!'});
				window.setTimeout(this.handleCloseModal, 500);
			});

			this.clipboard.on('error', (e) => {
				console.log('error copying');
			});
		}
	}

	shareOnFacebook = () => {
		const link = this.getLink()
		window.FB.ui(
		 {
		  method: 'share',
		  href: link
		}, function(response){
			console.log(response);
		});
	}

	handleOpenModal = () => {
		this.setState({showModal: true});
	}

	handleCloseModal = () => {
		this.setState({showModal: false, copyStatus: 'Copy link'});
	}

	getLink = () => {
		const { attempt } = this.props;
		let link = 'https://www.liftingondemand.com/';

		if (attempt && attempt._lifter) {
			link += 'lifter/' + attempt._lifter._id + '?att=' + attempt._id;
		}

		return link;
	}


	render() {
		return null;
		return (
			<div className='share-container'>
				<img onClick={this.handleOpenModal} className='share-arrow' src= {require('../images/share-arrow.png')} />
				{this.state.isActive &&
					<ReactModal 
			           isOpen={this.state.showModal}
			           contentLabel="Share"
			           shouldCloseOnOverlayClick={true}
			           onRequestClose={this.handleCloseModal}
			           className='modal-content'
			           overlayClassName='modal-overlay'
			         
			        >
			        <div className='modal-content-inner' onClick={this.handleCloseModal}>
			        	<div className='title'>
			        	Share attempt
			        	</div>
			        	<div className='buttons'>
				        	<div onClick={(e)=>e.stopPropagation()} data-clipboard-text={this.getLink()} className='copy-to-clipboard button share-button'>{this.state.copyStatus}</div>
				        	<img onClick={this.shareOnFacebook} className='share-button' src= {require('../images/FB-logo_29.png')} />
				        </div>
			        </div>
			        </ReactModal>
			    }
			</div>
		);	
	}
}

export default ShareIcon;
