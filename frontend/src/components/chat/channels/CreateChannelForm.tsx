import React, { useState } from 'react';

interface CreateChannelFormProps {
	isOpen: boolean;
	onSubmit: (name: string, privacy: string, password?: string) => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ isOpen, onSubmit }) => {
	const [name, setName] = useState('');
	const [isProtected, setIsProtected] = useState(false);
	const [password, setPassword] = useState('');

	if (!isOpen) {
		return null;
	}

	const handlePrivacyChange = () => {
		setIsProtected(!isProtected);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const privacy = isProtected ? 'PASSWORD_PROTECTED' : 'PUBLIC';
		onSubmit(name, privacy, isProtected ? password : undefined);
	};

	const isCreateButtonDisabled = name.trim() === '';

	return (
		<div className="popup">
			<form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="name" style={{ marginRight: '10px', fontSize: '14px' }}>
						Name:
					</label>
					<input
						type="text"
						id="name"
						maxLength={100}
						value={name}
						onChange={(event) => setName(event.target.value)}
						style={{ width: '150px' }}
					/>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ fontSize: '14px' }}>
						<input
							type="checkbox"
							checked={isProtected}
							onChange={handlePrivacyChange}
							style={{ marginRight: '5px' }}
						/>
						Protected
					</label>
				</div>

				{isProtected && (
					<div style={{ marginBottom: '10px' }}>
						<label
							htmlFor="password"
							style={{ marginRight: '10px', fontSize: '14px' }}
						>
							Password: 
						</label>
						<input
							type="password"
							id="password"
							maxLength={100}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							style={{ width: '150px' }}
						/>
					</div>
				)}

				<button
					type="submit"
					disabled={isCreateButtonDisabled}
					className={isCreateButtonDisabled ? 'disabled-button' : ''}
				>
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateChannelForm;
