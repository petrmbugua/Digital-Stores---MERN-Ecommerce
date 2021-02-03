import React, { useState } from 'react';
import { Button, Card, Form, Icon, Message, Container } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { Redirect } from 'react-router-dom';
import { signin } from './api-auth.js';

export default function Signin(props) {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
  });

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/',
    },
  };
  const { redirectToReferrer } = values;
  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <Container>
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>
              <Icon name='sign-in' /> Sign In
            </Card.Header>

            <Card.Description>
              <Form>
                <Form.Field>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='Enter Email'
                    value={values.email}
                    onChange={handleChange('email')}
                  />
                </Form.Field>
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
            <div className='ui two buttons'>
              <Button basic color='green' onClick={clickSubmit}>
                Submit
              </Button>
            </div>
          </Card.Content>
        </Card>
      </Card.Group>
    </Container>
  );
}
