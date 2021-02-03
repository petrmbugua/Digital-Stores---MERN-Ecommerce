import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button,  Message } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import cart from './cart-helper.js';
import { create } from './../order/api-order.js';
import { Redirect } from 'react-router-dom';

const PlaceOrder = (props) => {
  const [values, setValues] = useState({
    order: {},
    error: '',
    redirect: false,
    orderId: '',
  });

  const placeOrder = () => {
    const jwt = auth.isAuthenticated();
    create(
      { userId: jwt.user._id },
      {
        t: jwt.token,
      },
      props.checkoutDetails
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        cart.emptyCart(() => {
          setValues({ ...values, orderId: data._id, redirect: true });
        });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={'/order/' + values.orderId} />;
  }
  return (
    <>
      {values.error && (
        <Message error header={values.error} content={values.error} />
      )}

      <Button color='secondary' onClick={placeOrder}>
        Place Order
      </Button>
    </>
  );
};

PlaceOrder.propTypes = {
  checkoutDetails: PropTypes.object.isRequired,
};

export default PlaceOrder;
