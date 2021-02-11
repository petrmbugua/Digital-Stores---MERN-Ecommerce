import React, { useState, useEffect } from 'react';
import { Grid, Icon, Image, Segment } from 'semantic-ui-react';
import { read } from './api-shop.js';
import Products from './../product/Products';
import { listByShop } from './../product/api-product.js';

export default function Shop({ match }) {
  const [shop, setShop] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });
    read(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setShop(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.shopId]);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.shopId]);

  const logoUrl = shop._id
    ? `${process.env.REACT_APP_API}/api/shops/logo/${
        shop._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/shops/defaultphoto`;
  return (
    <Segment>
      <Grid>
        <Grid.Column width={5}>
          <>
            <Segment>
              Shop Name: <Icon className='shopping bag' /> {shop.name}
            </Segment>

            <Image src={logoUrl} />

            <Segment>
              Shop Description: <Icon className='shopping basket' />{' '}
              {shop.description}
            </Segment>
          </>
        </Grid.Column>
        <Grid.Column width={7}>
          <Segment>
            <Segment>Products</Segment>
            <Products products={products} searched={false} />
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
