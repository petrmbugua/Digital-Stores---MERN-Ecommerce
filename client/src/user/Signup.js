import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Icon,
  Message,
  Container,
} from 'semantic-ui-react';

import { makeStyles } from '@material-ui/core/styles';
import { create } from './api-user.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

export default function Signup() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    seller: '',
    open: false,
    error: '',
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = (event, checked) => {
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
        setValues({ ...values, error: '', open: true });
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

                  <Form.Field>
                    <label>Are Your A Seller ?</label>
                    <FormControlLabel
                      control={
                        <Switch
                          classes={{
                            checked: classes.checked,
                            bar: classes.bar,
                          }}
                          checked={values.seller}
                          onChange={handleCheck}
                        />
                      }
                      label={values.seller ? 'Yes' : 'No'}
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

      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to='/signin'>
            <Button color='primary' autoFocus='autoFocus' variant='contained'>
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
