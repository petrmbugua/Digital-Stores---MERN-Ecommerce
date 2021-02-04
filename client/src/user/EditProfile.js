import React, { useState, useEffect } from 'react';

import { Button, Card, Form, Icon, Message } from 'semantic-ui-react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import auth from './../auth/auth-helper';
import { read, update } from './api-user.js';
import { Redirect } from 'react-router-dom';

export default function EditProfile({ match }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    seller: false,
    redirectToProfile: false,
    error: '',
  });
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
          seller: data.seller,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      seller: values.seller || undefined,
    };
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.updateUser(data, () => {
          setValues({ ...values, userId: data._id, redirectToProfile: true });
        });
      }
    });
  };
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleCheck = (event, checked) => {
    setValues({ ...values, seller: checked });
  };

  if (values.redirectToProfile) {
    return <Redirect to={'/user/' + values.userId} />;
  }
  return (
    <>
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>
              <Icon name='user plus' /> Edit Profile
            </Card.Header>

            <Card.Description>
              <Form>
                <Form.Field>
                  <label>Name</label>
                  <input
                    type='text'
                    value={values.name}
                    onChange={handleChange('name')}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Email</label>
                  <input
                    type='email'
                    value={values.email}
                    onChange={handleChange('email')}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Seller Account</label>
                  <FormControlLabel
                    control={
                      <Switch checked={values.seller} onChange={handleCheck} />
                    }
                    label={values.seller ? 'Active' : 'Inactive'}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Password</label>
                  <input
                    type='password'
                    value={values.password}
                    onChange={handleChange('password')}
                  />
                </Form.Field>
              </Form>
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            {values.error && (
              <Message
                error
                header={<Icon name='info circle' />}
                content={values.error}
              />
            )}
            <div className='ui two buttons'>
              <Button basic color='green' onClick={clickSubmit}>
                Submit
              </Button>
            </div>
          </Card.Content>
        </Card>
      </Card.Group>
    </>
  );
}
