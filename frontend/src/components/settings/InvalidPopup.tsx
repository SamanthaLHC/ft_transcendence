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
                <p>name already exist or is not between 1 and 15 caracters.</p>
                <br />
                <button className="btn-size" onClick={onClose}>Close</button>
            </div>
        </div >
    ) : null;
}

export default InvalidPopup;