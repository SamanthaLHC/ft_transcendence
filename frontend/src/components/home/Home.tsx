import React, { useState } from 'react' 
import './Home.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Banner from './Banner';
import ButtonPlay from './ButtonPlay';


function Home()
{
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    return (
        <div>
            <Banner/>
            {/* <PersonnalSpace/> */}
            {/* </> */}
            {/* <Friends/> */}
            <ButtonPlay/>
            {/* <Chat/> */}
        </div>
    )
}

export default Home