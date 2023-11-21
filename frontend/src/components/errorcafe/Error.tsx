import React from 'react';
import cafe from '../../assets/cafe.png'

const ErrorCafe: React.FC = () => {
    return (
        <React.Fragment>
            <div id="container">
                <div className='image-center'>
                    <h2> /!\ Error 418 /!\ </h2>
                    <h2>I'm a teapot</h2>
                    <br />
                    <img src={cafe} alt='lol'></img>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ErrorCafe;