import React, { useState } from 'react';

interface CreateChannelFormProps {
	isOpen: boolean;
	onSubmit: (name: string, privacy: string, password?: string) => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ isOpen, onSubmit }) => {
	const [name, setName] = useState('');
	const [privacy, setPrivacy] = useState('PUBLIC');
	const [password, setPassword] = useState('');

	if (!isOpen) {
		return null;
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(name, privacy, privacy === 'PROTECTED' ? password : undefined);
	};

	const isCreateButtonDisabled = name.trim() === '';

	return (
		<div className="popup">
			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
				<br />

				<label htmlFor="privacy">Privacy:</label>
				<select
					id="privacy"
					value={privacy}
					onChange={(event) => setPrivacy(event.target.value)}
				>
					<option value="PUBLIC">PUBLIC</option>
					<option value="PRIVATE">PRIVATE</option>
					<option value="PROTECTED">PROTECTED</option>
				</select>
				<br />

				{privacy === 'PROTECTED' && (
					<>
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
						<br />
					</>
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
