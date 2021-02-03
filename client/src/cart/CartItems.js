import React, { useState } from 'react';
import auth from './../auth/auth-helper';
import { Card, Button, Divider, Segment, Item, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cart from './cart-helper.js';
import { Link } from 'react-router-dom';

export default function CartItems(props) {
  const [cartItems, setCartItems] = useState(cart.getCart());

  const handleChange = (index) => (event) => {
    let updatedCartItems = cartItems;
    if (event.target.value === 0) {
      updatedCartItems[index].quantity = 1;
    } else {
      updatedCartItems[index].quantity = event.target.value;
    }
    setCartItems([...updatedCartItems]);
    cart.updateCart(index, event.target.value);
  };

  const getTotal = () => {
    return cartItems.reduce((a, b) => {
      return a + b.quantity * b.product.price;
    }, 0);
  };

  const removeItem = (index) => (event) => {
    let updatedCartItems = cart.removeItem(index);
    if (updatedCartItems.length === 0) {
      props.setCheckout(false);
    }
    setCartItems(updatedCartItems);
  };

  const openCheckout = () => {
    props.setCheckout(true);
  };

  return (
    <Card fluid>
      <Segment>Shopping Cart</Segment>
      {cartItems.length > 0 ? (
        <span>
          {cartItems.map((item, i) => {
            return (
              <span key={i}>
                <Card fluid>
                  <Item.Group>
                    <Item>
                      <Item.Image
                        size='small'
                        src={'/api/product/image/' + item.product._id}
                      />

                      <Item.Content>
                        <Item.Header as='a'>
                          <Link to={'/product/' + item.product._id}>
                            {item.product.name}
                          </Link>
                        </Item.Header>
                        <Item.Meta>
                          <span className='price'>
                            Unit Price: Ksh. {item.product.price}
                          </span>
                        </Item.Meta>
                        <Item.Description>
                          <span className='price'>
                            Total Price: Ksh.{' '}
                            {item.product.price * item.quantity}
                          </span>
                        </Item.Description>
                        <Item.Description>
                          <Form.Group>
                            <label>Quantity:</label>
                            <Form.Input
                              type='number'
                              value={item.quantity}
                              inputProps={{
                                min: 1,
                              }}
                              onChange={handleChange(i)}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Button color='primary' onClick={removeItem(i)}>
                              x Remove
                            </Button>
                          </Form.Group>
                        </Item.Description>
                        <Item.Extra>Shop: {item.product.shop.name}</Item.Extra>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Card>
                <Divider />
              </span>
            );
          })}
          <>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header as='a'>
                    <span className='price'>Total: Ksh. {getTotal()}</span>
                  </Item.Header>
                  <Item.Description>
                    {!props.checkout &&
                      (auth.isAuthenticated() ? (
                        <Button color='secondary' onClick={openCheckout}>
                          Checkout
                        </Button>
                      ) : (
                        <Link to='/signin'>
                          <Button color='primary'>Sign in to checkout</Button>
                        </Link>
                      ))}
                    <Link to='/'>
                      <Button>Continue Shopping</Button>
                    </Link>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </>
        </span>
      ) : (
        <Segment>No items added to your cart.</Segment>
      )}
    </Card>
  );
}

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired,
};
