import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, Divider, Image } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import {
  getStatusValues,
  update,
  cancelProduct,
  processCharge,
} from './api-order.js';

export default function ProductOrderEdit(props) {
  const [values, setValues] = useState({
    open: 0,
    statusValues: [],
    error: '',
  });
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getStatusValues(signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: 'Could not get status' });
      } else {
        setValues({ ...values, statusValues: data, error: '' });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleStatusChange = (productIndex) => (event) => {
    let order = props.order;
    order.products[productIndex].status = event.target.value;
    let product = order.products[productIndex];

    if (event.target.value === 'Cancelled') {
      cancelProduct(
        {
          shopId: props.shopId,
          productId: product.product._id,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
          quantity: product.quantity,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: 'Status not updated, try again',
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: '',
          });
        }
      });
    } else if (event.target.value === 'Processing') {
      processCharge(
        {
          userId: jwt.user._id,
          shopId: props.shopId,
          orderId: order._id,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
          amount: product.quantity * product.product.price,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: 'Status not updated, try again',
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: '',
          });
        }
      });
    } else {
      update(
        {
          shopId: props.shopId,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: 'Status not updated, try again',
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: '',
          });
        }
      });
    }
  };

  return (
    <>
      <p>{values.error}</p>

      <List divided relaxed>
        {props.order.products.map((item, index) => {
          return (
            <List.Item key={index}>
              {item.shop === props.shopId && (
                <>
                  <Image
                    size='small'
                    src={'/api/product/image/' + item.product._id}
                  />
                  <List.Content>
                    <List.Header>{item.product.name}</List.Header>
                    <List.Description>
                      {'Quantity: ' + item.quantity}
                    </List.Description>

                    <label>Update Status:</label>
                    <select
                      value={item.status}
                      onChange={handleStatusChange(index)}
                    >
                      {values.statusValues.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    {/* <TextField
                      id='select-status'
                      select
                      label='Update Status'
                      value={item.status}
                      onChange={handleStatusChange(index)}
                    >
                      {values.statusValues.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField> */}
                  </List.Content>
                </>
              )}
              <Divider />
            </List.Item>
          );
        })}
      </List>
    </>
  );
}
ProductOrderEdit.propTypes = {
  shopId: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired,
};
