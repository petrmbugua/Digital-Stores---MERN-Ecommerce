import React, { useState } from 'react';
import { Card, Form, Segment, Message } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import cart from './cart-helper.js';
import PlaceOrder from './PlaceOrder';

export default function Checkout() {
  const user = auth.isAuthenticated().user;
  const [values, setValues] = useState({
    checkoutDetails: {
      products: cart.getCart(),
      customer_name: user.name,
      customer_email: user.email,
      delivery_address: {
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
      },
    },
    error: '',
  });

  const handleCustomerChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  const handleAddressChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails.delivery_address[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  return (
    <Card fluid>
      <Segment>Checkout</Segment>
      <Form>
        <Form.Field>
          <label>Name</label>
          <input
            placeholder='First Name'
            value={values.checkoutDetails.customer_name}
            onChange={handleCustomerChange('customer_name')}
          />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input
            type='email'
            placeholder='Email'
            value={values.checkoutDetails.customer_email}
            onChange={handleCustomerChange('customer_email')}
          />
        </Form.Field>
        <Segment>Delivery Address</Segment>
        <Form.Field>
          <label>Street Address</label>
          <input
            placeholder='Street Address'
            value={values.checkoutDetails.delivery_address.street}
            onChange={handleAddressChange('street')}
          />
        </Form.Field>

        <Form.Field>
          <label>City</label>
          <input
            placeholder='City'
            value={values.checkoutDetails.delivery_address.city}
            onChange={handleAddressChange('city')}
          />
        </Form.Field>

        <Form.Field>
          <label>State</label>
          <input
            placeholder='State'
            value={values.checkoutDetails.delivery_address.state}
            onChange={handleAddressChange('state')}
          />
        </Form.Field>

        <Form.Field>
          <label>Zip Code</label>
          <input
            placeholder='Zip Code'
            value={values.checkoutDetails.delivery_address.zipcode}
            onChange={handleAddressChange('zipcode')}
          />
        </Form.Field>

        <Form.Field>
          <label>Country</label>
          <input
            placeholder='Country'
            value={values.checkoutDetails.delivery_address.country}
            onChange={handleAddressChange('country')}
          />
        </Form.Field>
        {values.error && (
          <Message error header={values.error} content={values.error} />
        )}
      </Form>

      <>
        <PlaceOrder checkoutDetails={values.checkoutDetails} />
      </>
    </Card>
  );
}
