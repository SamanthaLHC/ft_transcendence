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
            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="name" style={{ marginRight: '10px', fontSize: '14px' }}>
                        Name:
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                        style={{ width: '150px' }}
                    />
                </div>
                {/* 
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
                </div> */}

                {/* {isProtected && ( */}
                {/* <div style={{ marginBottom: '10px' }}>
                    <label
                        htmlFor="time"
                        style={{ marginRight: '10px', fontSize: '14px' }}
                    >
                        Password:
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                        style={{ width: '150px' }}
                    />
                </div> */}
                {/* )} */}

                <button
                    type="submit"
                    disabled={isCreateButtonDisabled}
                    className={isCreateButtonDisabled ? 'disabled-button' : ''}
                >
                    Apply
                </button>
            </form>
        </div>
    );
};

export default MuteForm;
