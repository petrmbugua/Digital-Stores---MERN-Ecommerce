import React, { useState, useEffect } from 'react';
import { Card, Segment, Grid, Divider, Item } from 'semantic-ui-react';
import { read } from './api-order.js';
import { Link } from 'react-router-dom';

export default function Order({ match }) {
  const [order, setOrder] = useState({ products: [], delivery_address: {} });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({
      orderId: match.params.orderId,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrder(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const getTotal = () => {
    return order.products.reduce((a, b) => {
      const quantity = b.status === 'Cancelled' ? 0 : b.quantity;
      return a + quantity * b.product.price;
    }, 0);
  };

  return (
    <Card fluid>
      <Segment>Order Details</Segment>

      <Segment>
        Order Code: <strong>{order._id}</strong> <br /> Placed on{' '}
        {new Date(order.created).toDateString()}
      </Segment>

      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Item.Group>
              {order.products.map((item, i) => {
                return (
                  <span key={i}>
                    <Item>
                      <Item.Image
                        size='small'
                        src={'/api/product/image/' + item.product._id}
                      />

                      <Item.Content>
                        <Item.Header>
                          <Link to={'/product/' + item.product._id}>
                            {item.product.name}
                          </Link>
                        </Item.Header>
                        <Item.Meta>
                          <span className='price'>
                            Ksh. {item.product.price} x {item.quantity}
                          </span>
                        </Item.Meta>
                        <Item.Meta>
                          <span className='price'>
                            Ksh. {item.product.price * item.quantity}
                          </span>
                        </Item.Meta>
                        <Item.Meta>
                          <span className='price'>Shop: {item.shop.name}</span>
                        </Item.Meta>

                        <Segment
                          color={
                            item.status === 'Cancelled' ? 'error' : 'secondary'
                          }
                        >
                          Status: {item.status}
                        </Segment>
                      </Item.Content>
                    </Item>
                    <Divider />
                  </span>
                );
              })}
              <Segment>
                <span>Total: Ksh. {getTotal()}</span>
              </Segment>
            </Item.Group>
          </Grid.Column>

          <Grid.Column>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header>Deliver to:</Item.Header>
                  <Item.Meta>
                    <strong>{order.customer_name}</strong>
                  </Item.Meta>

                  <Item.Meta>{order.customer_email}</Item.Meta>

                  <Divider />

                  <Item.Meta>{order.delivery_address.street}</Item.Meta>
                  <Item.Meta>
                    {order.delivery_address.city},{' '}
                    {order.delivery_address.state}{' '}
                    {order.delivery_address.zipcode}
                  </Item.Meta>
                  <Item.Meta>{order.delivery_address.country}</Item.Meta>
                  <Segment>
                    Thank you for shopping with us! <br />
                    You can track the status of your purchased items on this
                    page.
                  </Segment>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card>
  );
}
