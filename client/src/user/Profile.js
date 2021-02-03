import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Icon, Button } from 'semantic-ui-react';
import DeleteUser from './DeleteUser';
import auth from './../auth/auth-helper';
import { read } from './api-user.js';
import { Redirect, Link } from 'react-router-dom';
import MyOrders from './../order/MyOrders';

export default function Profile({ match }) {
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
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
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignin) {
    return <Redirect to='/signin' />;
  }
  return (
    <>
      <Container>
        <Card fluid>
          <Header as='h2'>Profile</Header>

          <Card.Content>
            <Card.Header>
              <Icon name='user circle' /> {user.name} {user.email}
            </Card.Header>
            <Card.Meta>
              <span className='date'>
                Joined: {new Date(user.created).toDateString()}{' '}
              </span>
            </Card.Meta>
            <Card.Description>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id === user._id && (
                  <>
                    <Link to={'/user/edit/' + user._id}>
                      <Button>
                        <Icon name='edit outline' />
                      </Button>
                    </Link>

                    <DeleteUser userId={user._id} />
                  </>
                )}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <MyOrders />
          </Card.Content>
        </Card>
      </Container>
    </>
  );
}
