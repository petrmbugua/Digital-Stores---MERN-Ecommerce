import React, { useState, useEffect } from 'react';
import { Segment, List, Divider, Accordion, Icon } from 'semantic-ui-react';
import auth from './../auth/auth-helper';
import { listByShop } from './api-order.js';
import ProductOrderEdit from './ProductOrderEdit';

export default function ShopOrders({ match }) {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(0);

  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByShop(
      {
        shopId: match.params.shopId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleClick = (index) => (event) => {
    setOpen(index);
  };

  const updateOrders = (index, updatedOrder) => {
    let updatedOrders = orders;
    updatedOrders[index] = updatedOrder;
    setOrders([...updatedOrders]);
  };

  return (
    <Segment>
      <Segment>Orders in {match.params.shop}</Segment>

      <List divided relaxed>
        {orders.map((order, index) => {
          return (
            <Accordion>
              <span key={index}>
                <Accordion.Title
                  active={open === index}
                  onClick={handleClick(index)}
                >
                  <List.Item>
                    <List.Content>
                      <List.Header>{'Order # ' + order._id}</List.Header>
                      <List.Description as='a'>
                        {new Date(order.created).toDateString()}
                      </List.Description>

                      {open === index ? (
                        <Icon className='chevron up' />
                      ) : (
                        <Icon className='chevron down' />
                      )}
                    </List.Content>
                  </List.Item>
                </Accordion.Title>

                <Divider />

                <Accordion.Content active={open === index}>
                  <ProductOrderEdit
                    shopId={match.params.shopId}
                    order={order}
                    orderIndex={index}
                    updateOrders={updateOrders}
                  />
                  <>
                    <Segment>Deliver to:</Segment>
                    <List>
                      <List.Item>
                        <List.Icon name='user' />
                        <List.Content>{order.customer_name}</List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Icon name='mail' />
                        <List.Content>{order.customer_email}</List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Icon name='marker' />
                        <List.Content>
                          {order.delivery_address.street},{' '}
                          {order.delivery_address.city},{' '}
                          {order.delivery_address.state},{' '}
                          {order.delivery_address.zipcode}
                        </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Icon name='globe' />
                        <List.Content>
                          {order.delivery_address.country}
                        </List.Content>
                      </List.Item>
                    </List>
                  </>
                </Accordion.Content>

                <Divider />
              </span>
            </Accordion>
          );
        })}
      </List>
    </Segment>
  );
}
