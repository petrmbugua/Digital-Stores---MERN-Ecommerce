import React, { useEffect, useState } from 'react';
import {
  Form,
  Image,
  Segment,
  Icon,
  Button,
  TextArea,
  Message,
} from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { read, update } from './api-product.js';
import { Link, Redirect } from 'react-router-dom';

export default function EditProduct({ match }) {
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
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read(
      {
        productId: match.params.productId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          description: data.description,
          category: data.category,
          quantity: data.quantity,
          price: data.price,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  const clickSubmit = () => {
    let productData = new FormData();
    values.name && productData.append('name', values.name);
    values.description && productData.append('description', values.description);
    values.image && productData.append('image', values.image);
    values.category && productData.append('category', values.category);
    values.quantity && productData.append('quantity', values.quantity);
    values.price && productData.append('price', values.price);

    update(
      {
        shopId: match.params.shopId,
        productId: match.params.productId,
      },
      {
        t: jwt.token,
      },
      productData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };
  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const imageUrl = values.id
    ? `${process.env.REACT_APP_API}/api/product/image/${
        values.id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/product/defaultphoto`;
  if (values.redirect) {
    return <Redirect to={'/seller/shop/edit/' + match.params.shopId} />;
  }
  return (
    <Segment>
      <Segment>Edit Product</Segment>
      <Image src={imageUrl} className='small' />
      <Form>
        <Form.Field>
          <Button as='label' htmlFor='file' type='button'>
            Change Image <Icon name='file image' size='large' />{' '}
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
          <label>Product Name:</label>
          <input
            type='text'
            value={values.name}
            onChange={handleChange('name')}
          />
        </Form.Field>

        <Form.Field>
          <label>Product Description:</label>
          <TextArea
            value={values.description}
            onChange={handleChange('description')}
          />
        </Form.Field>

        <Form.Field>
          <label>Product Category:</label>
          <input
            type='text'
            value={values.category}
            onChange={handleChange('category')}
          />
        </Form.Field>

        <Form.Field>
          <label>Product Quantity:</label>
          <input
            value={values.quantity}
            onChange={handleChange('quantity')}
            type='number'
          />
        </Form.Field>

        <Form.Field>
          <label>Product Price:</label>
          <input
            value={values.price}
            onChange={handleChange('price')}
            type='number'
          />
        </Form.Field>

        {values.error && (
          <Message error header={values.error} content={values.error} />
        )}

        <Button color='primary' onClick={clickSubmit}>
          Update
        </Button>
        <Link to={'/seller/shops/edit/' + match.params.shopId}>
          <Button>Cancel</Button>
        </Link>
      </Form>
    </Segment>
  );
}
