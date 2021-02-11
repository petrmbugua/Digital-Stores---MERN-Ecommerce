import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Grid,
  Form,
  Icon,
  Image,
  TextArea,
} from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { read, update } from './api-shop.js';
import { Redirect } from 'react-router-dom';
import MyProducts from './../product/MyProducts';

export default function EditShop({ match }) {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    redirect: false,
    error: '',
    id: '',
  });
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read(
      {
        shopId: match.params.shopId,
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
          owner: data.owner.name,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const clickSubmit = () => {
    let shopData = new FormData();
    values.name && shopData.append('name', values.name);
    values.description && shopData.append('description', values.description);
    values.image && shopData.append('image', values.image);
    update(
      {
        shopId: match.params.shopId,
      },
      {
        t: jwt.token,
      },
      shopData
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

  const logoUrl = values.id
    ? `${process.env.REACT_APP_API}/api/shops/logo/${
        values.id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/shops/defaultphoto`;
  if (values.redirect) {
    return <Redirect to={'/seller/shops'} />;
  }
  return (
    <>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Card.Group>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Edit Shop</Card.Header>
                  <Card.Meta>
                    <Image src={logoUrl} size='small' />
                  </Card.Meta>
                  <Card.Description>
                    <Form>
                      <Form.Field>
                        <Button as='label' htmlFor='file' type='button'>
                          Change Logo <Icon name='file image' size='large' />{' '}
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
                          value={values.name}
                          onChange={handleChange('name')}
                        />
                      </Form.Field>

                      <Form.Field>
                        <label>Description:</label>
                        <TextArea
                          value={values.description}
                          onChange={handleChange('description')}
                        />
                      </Form.Field>
                    </Form>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Icon name='user' />
                  Owner: {values.owner}
                </Card.Content>
                <Card.Content>
                  {values.error && (
                    <p>
                      <Icon name='info circle' />
                      {values.error}
                    </p>
                  )}

                  <Button onClick={clickSubmit}>Update</Button>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>

          <Grid.Column>
            <MyProducts shopId={match.params.shopId} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
