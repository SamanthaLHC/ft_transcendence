import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onJoin: (password: string) => void;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({ open, onClose, onJoin }) => {
  const [password, setPassword] = useState('');

  const handleJoinClick = () => {
    onJoin(password);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Password</DialogTitle>
      <DialogContent>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleJoinClick}>
          Join
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;