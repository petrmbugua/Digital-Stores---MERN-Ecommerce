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
import { create } from './api-product.js';
import { Link, Redirect } from 'react-router-dom';

export default function NewProduct({ match }) {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    redirect: false,
    error: '',
  });
  const jwt = auth.isAuthenticated();
  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const clickSubmit = () => {
    let productData = new FormData();
    values.name && productData.append('name', values.name);
    values.description && productData.append('description', values.description);
    values.image && productData.append('image', values.image);
    values.category && productData.append('category', values.category);
    values.quantity && productData.append('quantity', values.quantity);
    values.price && productData.append('price', values.price);

    create(
      {
        shopId: match.params.shopId,
      },
      {
        t: jwt.token,
      },
      productData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '', redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={'/seller/shop/edit/' + match.params.shopId} />;
  }
  return (
    <>
      <Segment>
        <Form>
          <Segment>Add New Product</Segment>
          <Form.Field>
            <Button as='label' htmlFor='file' type='button'>
              Upload Photo <Icon name='file image' size='large' />{' '}
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
            <label>Product Name</label>
            <input
              placeholder='Product Name'
              value={values.name}
              onChange={handleChange('name')}
            />
          </Form.Field>
          <Form.Field>
            <label>Product Description</label>
            <TextArea
              placeholder='Description'
              value={values.description}
              onChange={handleChange('description')}
            />
          </Form.Field>

          <Form.Field>
            <label>Product Category</label>
            <input
              placeholder='Category'
              value={values.category}
              onChange={handleChange('category')}
            />
          </Form.Field>

          <Form.Field>
            <label>Product Quantity</label>
            <input
              placeholder='Quantity'
              value={values.quantity}
              onChange={handleChange('quantity')}
              type='number'
            />
          </Form.Field>

          <Form.Field>
            <label>Product Price</label>
            <input
              placeholder='Price'
              value={values.price}
              onChange={handleChange('price')}
              type='number'
            />
          </Form.Field>

          {values.error && (
            <Message error header={values.error} content={values.error} />
          )}

          <Button color='primary' onClick={clickSubmit}>
            Submit
          </Button>
          <Link to={'/seller/shop/edit/' + match.params.shopId}>
            <Button>Cancel</Button>
          </Link>
        </Form>
      </Segment>
    </>
  );
}
