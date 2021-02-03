import React, { useState } from 'react';
import {
  Form,
  Segment,
  Icon,
  Button,
  TextArea,
  Message,
} from 'semantic-ui-react';

import auth from './../auth/auth-helper';
import { create } from './api-shop.js';
import { Link, Redirect } from 'react-router-dom';

export default function NewShop() {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    redirect: false,
    error: '',
  });
  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const clickSubmit = () => {
    let shopData = new FormData();
    values.name && shopData.append('name', values.name);
    values.description && shopData.append('description', values.description);
    values.image && shopData.append('image', values.image);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      shopData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '', redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={'/seller/shops'} />;
  }
  return (
    <Segment>
      <Segment>Add A New Shop</Segment>
      <Form>
        <Form.Field>
          <Button as='label' htmlFor='file' type='button'>
            Upload Logo <Icon name='file image' size='large' />{' '}
            {values.image ? values.image.name : ''}
          </Button>

          <input
            accept='image/*'
            onChange={handleChange('image')}
            id='file'
            type='file'
            hidden
          />
        </Form.Field>

        <Form.Field>
          <label>Shop Name:</label>
          <input
            type='text'
            placeholder='Shop Name'
            value={values.name}
            onChange={handleChange('name')}
          />
        </Form.Field>

        <Form.Field>
          <label>Shop Description:</label>
          <TextArea
            value={values.description}
            placeholder='Shop Description'
            onChange={handleChange('description')}
          />
        </Form.Field>

        {values.error && (
          <Message error header={values.error} content={values.error} />
        )}

        <Button color='primary' onClick={clickSubmit}>
          Submit
        </Button>
        <Link to='/seller/shops'>
          <Button>Cancel</Button>
        </Link>
      </Form>
    </Segment>
  );
}
