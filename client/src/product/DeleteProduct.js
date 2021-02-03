import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { remove } from './api-product.js';

export default function DeleteProduct(props) {
  const [open, setOpen] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteProduct = () => {
    remove(
      {
        shopId: props.shopId,
        productId: props.product._id,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.product);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button onClick={clickButton}>
        <Icon name='trash' />
      </Button>

      <Confirm
        open={open}
        header={'Delete ' + props.product.name}
        content={'Confirm to delete your product - ' + props.product.name}
        cancelButton='Cancel'
        confirmButton='Confirm'
        onCancel={handleRequestClose}
        onClick={deleteProduct}
      />
    </>
  );
}
DeleteProduct.propTypes = {
  shopId: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
