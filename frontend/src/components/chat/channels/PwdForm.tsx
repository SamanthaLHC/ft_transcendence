import React, { useState } from 'react';

interface PwdFormProps {
    isOpen: boolean;
    onSubmit: (password: string) => Promise<void>;
}

const PwdForm: React.FC<PwdFormProps> = ({ isOpen, onSubmit }) => {
    const [password, setPwd] = useState('');

    if (!isOpen) {
        return null;
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await onSubmit(password);
            setPwd('');
        } catch (error) {
            console.error(error);
        }
    };

    const isCreateButtonDisabled = password.trim() === '';

    return (
        <div className="popup">
            <form onSubmit={handleSubmit} className="mute-form">
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        new password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => { setPwd(event.target.value) }}
                        className="form-input"
                    />
                </div>
                <div className='form-button-pos'>
                    <button
                        type="submit"
                        disabled={isCreateButtonDisabled}
                        className={`form-button ${isCreateButtonDisabled ? 'disabled-button' : ''}`}
                    >
                        Apply
                    </button>
                </div>
            </form>
        </div>
    );
};


export default PwdForm;
