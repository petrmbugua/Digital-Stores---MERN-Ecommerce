import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { remove } from './api-user.js';
import { Redirect } from 'react-router-dom';

export default function DeleteUser(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteAccount = () => {
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log('deleted'));
        setRedirect(true);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Redirect to='/' />;
  }
  return (
    <>
      <Button onClick={clickButton}>
      <Icon name='user delete' />
      </Button>

      <Confirm
        open={open}
        header='Delete Account'
        content='Confirm to delete your account'
        cancelButton='Cancel'
        confirmButton='Confirm'
        onCancel={handleRequestClose}
        onConfirm={deleteAccount}
      />

    </>
  );
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
