import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Icon,
  Message,
  Container,
  // Checkbox,
  Confirm,
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { create } from './api-user.js';

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    seller: '',
    // open: false,
    error: '',
  });
  const [redirect, setRedirect] = useState(false);
  const [open, setOpen] = useState(false);
  const handleRequestClose = () => {
    setOpen(false);
  };
  const confirmAccount = () => {
    setRedirect(true);
  };
  if (redirect) {
    return <Redirect to='/signin' />;
  }

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleCheck = (e, checked) => {
    setValues({ ...values, seller: checked });
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      seller: values.seller || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          error: '',
          // open: true
        });
        setOpen(true);
      }
    });
  };
  return (
    <>
      <Container>
        <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header>
                <Icon name='user plus' /> Sign Up
              </Card.Header>

              <Card.Description>
                <Form>
                  <Form.Field>
                    <label>Name</label>
                    <input
                      type='text'
                      placeholder='Enter Your Name'
                      value={values.name}
                      onChange={handleChange('name')}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Email</label>
                    <input
                      type='email'
                      placeholder='Enter Email'
                      value={values.email}
                      onChange={handleChange('email')}
                    />
                  </Form.Field>

                  {/* <Form.Field>
                    <label>Are you a Seller ?</label>
                    <Checkbox
                      toggle
                      checked={values.seller}
                      onChange={handleCheck}
                      label={values.seller ? 'Yes' : 'No'}
                    />
                  </Form.Field> */}

                  {/* <Form.Field>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.seller}
                          onChange={handleCheck}
                        />
                      }
                      label={values.seller ? 'Yes' : 'No'}
                    />
                  </Form.Field> */}

                  <Form.Field>
                    <label>Password</label>
                    <input
                      type='password'
                      placeholder='Enter Password'
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
              <>
                <Button onClick={clickSubmit}>Submit</Button>
              </>
            </Card.Content>
          </Card>
        </Card.Group>
      </Container>

      <Confirm
        open={open}
        header='New Account Created'
        content='New account successfully created.'
        cancelButton='Cancel'
        confirmButton='Signin'
        onCancel={handleRequestClose}
        onConfirm={confirmAccount}
      />
    </>
  );
}
