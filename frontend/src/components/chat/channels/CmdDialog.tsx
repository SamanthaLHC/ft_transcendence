import React, { useState } from 'react';

interface CmdDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

const CmdDialog: React.FC<CmdDialogProps> = (props) => {
	const { isOpen, onClose } = props;

	if (!isOpen) {
		return null;
	}

	return (
		<dialog className="dialog">
			<div className='dialog-header'>
				<div className="dialog-title azonix yellow ">Who?</div>
				<div className='close-btn-pos '>
					<button className='close-btn' onClick={onClose}>x</button>
				</div>
			</div>
			<div className="dialog-content">
				<input
					className='input-pos'
					type="text"
					placeholder="User login"
				/>
				<div>
					<div className="form-owner-section">
						<button className="btn-dialog">Set as admin</button>
					</div>
					<div className="form-regular-user-section">
						<button className="btn-dialog">Invite to play</button>
						<button className="btn-dialog">See profile page</button>
						<button className="btn-dialog">Private message</button>
						<button className="btn-dialog">Block</button>
					</div>
					<div className="form-admin-section">
						<button className="btn-dialog">Ban</button>
						<button className="btn-dialog">Kick</button>
						<button className="btn-dialog">Mute</button>
					</div>
				</div>
			</div>
		</dialog>
	);
};

export default CmdDialog;
