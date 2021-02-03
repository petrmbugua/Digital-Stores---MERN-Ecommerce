import React, { useState, useEffect } from 'react';
import { Segment, List, Divider } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { listByUser } from './api-order.js';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByUser(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Segment>
      <Segment>Your Orders</Segment>
      <List divided relaxed>
        {orders.map((order, i) => {
          return (
            <List.Item key={i}>
              <Link to={'/order/' + order._id}>
                <List.Content>
                  <List.Header as='a'>
                    {<strong>{'Order # ' + order._id}</strong>}
                  </List.Header>
                  <List.Description>
                    {new Date(order.created).toDateString()}
                  </List.Description>
                </List.Content>
              </Link>
              <Divider />
            </List.Item>
          );
        })}
      </List>
    </Segment>
  );
}
