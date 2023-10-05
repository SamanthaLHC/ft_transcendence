import React from 'react';
import ducky from '../../assets/200w.gif'

const Twofa: React.FC = () => {
    return (
        <React.Fragment>
            <div id="container">
                <div className='image-center'>
                    <h2>Scan this QR code:</h2>
                    <br />
                    <img src={ducky} alt='lol'></img>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Twofa;