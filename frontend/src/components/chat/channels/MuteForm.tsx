import React, { useState } from 'react';

interface MuteFormProps {
    isOpen: boolean;
    onSubmit: (time: string) => Promise<void>;
}

const MuteForm: React.FC<MuteFormProps> = ({ isOpen, onSubmit }) => {
    const [time, setTime] = useState('');

    if (!isOpen) {
        return null;
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await onSubmit(time);
            setTime('');
        } catch (error) {
            console.error(error);
        }
    };

    const isCreateButtonDisabled = time.trim() === '';

    return (
        <div className="popup">
            <form onSubmit={handleSubmit} className="mute-form">
                <div className="form-group">
                    <label htmlFor="time" className="form-label">
                        mute duration in secondes:
                    </label>
                    <input
                        type="number"
                        id="time"
                        value={time}
                        min = "0"
                        max = "86400"
                        onChange={(event) => {
                            const inputValue = event.target.value;
                            if (/^\d+$/.test(inputValue) || inputValue === '') {
                                setTime(inputValue);
                            }
                        }}
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
