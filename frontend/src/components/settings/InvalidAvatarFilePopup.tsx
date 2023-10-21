import React from 'react';

interface InvalidAvatarFilePopupProps {
	isOpen: boolean;
	onClose: () => void;
}

const InvalidAvatarFilePopup: React.FC<InvalidAvatarFilePopupProps> = ({ isOpen, onClose }) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="change-name">

			<div className='yellow'>
				<h2>Invalid file</h2>
				<p> correct format are: (image/png, image/jpeg, image/gif).</p>
				<br />
				<button className='btn-size' onClick={onClose}>close</button>
			</div>
		</div>
	);
};

export default InvalidAvatarFilePopup;