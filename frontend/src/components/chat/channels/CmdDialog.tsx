import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';

interface CmdDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const CmdDialog: React.FC<CmdDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle className='btn-pos'>Who?</DialogTitle>
            <DialogContent>
                <TextField
                    label="user login"
                    type="text"
                    value=""
                    onChange={(e) => e.target.value}
                />
                <div className='center'>
                    <div className='form-owner-section'>
                        <button className='btn-size'>set as admin</button>
                    </div>
                    <div className='form-regular-user-section'>
                        <button className='btn-size'>invite to play</button>
                        <button className='btn-size'>see profile page</button>
                        <button className='btn-size'>private message</button>
                        <button className='btn-size'>block</button>
                    </div>
                    <div className='form-admin-section'>
                        <button className='btn-size'>ban</button>
                        <button className='btn-size'>kick</button>
                        <button className='btn-size'>mute</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CmdDialog;
