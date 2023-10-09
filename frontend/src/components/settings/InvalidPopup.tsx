import React from 'react';


interface InvalidPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

function InvalidPopup({ isOpen, onClose }: InvalidPopupProps) {
    return isOpen ? (
        <div className="change-name">
            <div className='yellow'>
                <h2>Invalid Name</h2>
                <p>should be between 1 and 15 caracter.</p>
                <br />
                <button className="btn-size" onClick={onClose}>Close</button>
            </div>
        </div >
    ) : null;
}

export default InvalidPopup;