import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { remove } from './api-shop.js';

export default function DeleteShop(props) {
  const [open, setOpen] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteShop = () => {
    remove(
      {
        shopId: props.shop._id,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.shop);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };
  return (
    <span>
      <Button onClick={clickButton}>
        <Icon name='trash' />
      </Button>
 
      <Confirm
        open={open}
        header={'Delete ' + props.shop.name}
        content={'Confirm to delete your shop ' + props.shop.name}
        cancelButton='Cancel'
        confirmButton='Confirm'
        onCancel={handleRequestClose}
        onConfirm={deleteShop}
      />
    </span>
  );
}
DeleteShop.propTypes = {
  shop: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
