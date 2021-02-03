import React, { useState, useEffect } from 'react';
import { Segment, List, Image } from 'semantic-ui-react';
import { list } from './api-shop.js';
import { Link } from 'react-router-dom';

export default function Shops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setShops(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Segment>
      <Segment>All Shops</Segment>

      <List divided relaxed>
        {shops.map((shop, i) => {
          return (
            <List.Item as='a'>
              <Link to={'/shops/' + shop._id} key={i}>
                <Image
                  alt={shop.name}
                  size='small'
                  src={
                    '/api/shops/logo/' + shop._id + '?' + new Date().getTime()
                  }
                />

                <List.Content>
                  <List.Header>{shop.name}</List.Header>
                  <List.Description>{shop.description}</List.Description>
                </List.Content>
              </Link>
            </List.Item>
          );
        })}
      </List>
    </Segment>
  );
}
