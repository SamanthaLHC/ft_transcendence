import React, { useState } from 'react';

interface MuteFormProps {
    isOpen: boolean;
    onSubmit: (time: string) => void;
}

const MuteForm: React.FC<MuteFormProps> = ({ isOpen, onSubmit }) => {
    const [time, setTime] = useState('');

    if (!isOpen) {
        return null;
    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(time);
    };

    const isCreateButtonDisabled = time.trim() === '';

    return (
        <div className="popup">
            <form onSubmit={handleSubmit} className="mute-form">
                <div className="form-group">
                    <label htmlFor="time" className="form-label">
                        Time in secondes:
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
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


export default MuteForm;
