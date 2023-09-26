import React from 'react';
import ducky from '../../assets/200w.gif'

export default function Error() {
    return (
        <React.Fragment>
            <div id="container">
                <div className='image-center'>
                    <h2> /!\ This page doesn't exist /!\ </h2>
                    <br />
                    <img src={ducky} alt='lol'></img>
                </div>
            </div>
        </React.Fragment>
    )
}