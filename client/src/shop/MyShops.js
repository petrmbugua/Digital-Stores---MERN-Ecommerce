import React, { useState, useEffect } from 'react';
import { Card, Button, Icon, Divider, List, Image } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { listByOwner } from './api-shop.js';
import { Redirect, Link } from 'react-router-dom';
import DeleteShop from './DeleteShop';

export default function MyShops() {
  const [shops, setShops] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByOwner(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        setShops(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const removeShop = (shop) => {
    const updatedShops = [...shops];
    const index = updatedShops.indexOf(shop);
    updatedShops.splice(index, 1);
    setShops(updatedShops);
  };

  if (redirectToSignin) {
    return <Redirect to='/signin' />;
  }
  return (
    <>
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>Your Shops</Card.Header>
            <Card.Meta>
              <Link to='/seller/shop/new'>
                <Button color='primary'>
                  <Icon name='add circle' size='large' /> New Shop
                </Button>
              </Link>
            </Card.Meta>
            <Divider />
            <Card.Description>
              {shops.map((shop, i) => {
                return (
                  <List key={i}>
                    <List.Item>
                      <Image
                        size='small'
                        src={
                          `${process.env.REACT_APP_API}/api/shops/logo/` +
                          shop._id +
                          '?' +
                          new Date().getTime()
                        }
                      />
                      <List.Content>
                        <List.Header>{shop.name}</List.Header>
                        <List.Description>{shop.description}</List.Description>
                      </List.Content>

                      {auth.isAuthenticated().user &&
                        auth.isAuthenticated().user._id === shop.owner._id && (
                          <List.Content>
                            <Link
                              to={
                                '/seller/orders/' + shop.name + '/' + shop._id
                              }
                            >
                              <Button color='primary'>View Orders</Button>
                            </Link>
                            <Link to={'/seller/shop/edit/' + shop._id}>
                              <Button>
                                <Icon name='edit' size='large' />
                              </Button>
                            </Link>
                            <DeleteShop shop={shop} onRemove={removeShop} />
                          </List.Content>
                        )}
                    </List.Item>
                  </List>
                );
              })}
            </Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    </>
  );
}
