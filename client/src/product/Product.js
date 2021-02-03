import React, { useState, useEffect } from 'react';
import { Segment, Icon, Grid, Item, } from 'semantic-ui-react';
import { read, listRelated } from './api-product.js';
import { Link } from 'react-router-dom';
import Suggestions from './../product/Suggestions';
import AddToCart from './../cart/AddToCart';

export default function Product({ match }) {
  const [product, setProduct] = useState({ shop: {} });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ productId: match.params.productId }, signal).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.productId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listRelated(
      {
        productId: match.params.productId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setSuggestions(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.productId]);

  const imageUrl = product._id
    ? `/api/product/image/${product._id}?${new Date().getTime()}`
    : '/api/product/defaultphoto';
  return (
    <Segment>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Item.Group>
              <Item>
                <Item.Image size='medium' src={imageUrl} />

                <Item.Content>
                  <Item.Meta>
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </Item.Meta>
                  <Item.Header>{product.name} </Item.Header>
                  <Item.Meta>
                    <span className='price'>Ksh. {product.price}</span>
                  </Item.Meta>
                  <Item.Description>{product.description}</Item.Description>
                  <Item.Description>
                    <Link to={'/shops/' + product.shop._id}>
                      <span>
                        <Icon className='shopping basket' /> {product.shop.name}
                      </span>
                    </Link>
                  </Item.Description>
                  <Item.Description>
                    <AddToCart item={product} />
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>

          {suggestions.length > 0 && (
            <Grid.Column>
              <Suggestions products={suggestions} title='Related Products' />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Segment>
  );
}
