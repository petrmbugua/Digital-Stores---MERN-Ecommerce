import React, { useState } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cart from './cart-helper.js';
import { Redirect } from 'react-router-dom';

export default function AddToCart(props) {
  const [redirect, setRedirect] = useState(false);

  const addToCart = () => {
    cart.addItem(props.item, () => {
      setRedirect({ redirect: true });
    });
  };
  if (redirect) {
    return <Redirect to={'/cart'} />;
  }
  return (
    <span>
      {props.item.quantity >= 0 ? (
        <Button onClick={addToCart}>
          <Icon name='add to cart' />
        </Button>
      ) : (
        <Button>
          <Icon name='shopping cart' />
        </Button>
      )}
    </span>
  );
}

AddToCart.propTypes = {
  item: PropTypes.object.isRequired,
  cartStyle: PropTypes.string,
};
