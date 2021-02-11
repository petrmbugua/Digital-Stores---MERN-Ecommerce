import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Segment, List, Button, Image, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { listByShop } from './../product/api-product.js';
import DeleteProduct from './../product/DeleteProduct';

export default function MyProducts(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop(
      {
        shopId: props.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const removeProduct = (product) => {
    const updatedProducts = [...products];
    const index = updatedProducts.indexOf(product);
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  return (
    <Segment>
      <Segment>
        Products{' '}
        <Link to={'/seller/' + props.shopId + '/products/new'}>
          <Button color='primary'>
            <Icon className='add' /> New Product
          </Button>
        </Link>
      </Segment>
      <List divided relaxed>
        {products.map((product, i) => {
          return (
            <List.Item key={i}>
              <Image
                size='small'
                src={
                  `${process.env.REACT_APP_API}/api/product/image/` +
                  product._id +
                  '?' +
                  new Date().getTime()
                }
                alt={product.name}
              />
              <List.Content>
                <List.Header>{product.name}</List.Header>
                <List.Description>
                  Quantity: {product.quantity} | Price: Ksh. {product.price}
                </List.Description>
                <List.Description>
                  <Link
                    to={
                      '/seller/' +
                      product.shop._id +
                      '/' +
                      product._id +
                      '/edit'
                    }
                  >
                    <Icon className='pencil' />
                  </Link>
                  <DeleteProduct
                    product={product}
                    shopId={props.shopId}
                    onRemove={removeProduct}
                  />
                </List.Description>
              </List.Content>

              <Divider />
            </List.Item>
          );
        })}
      </List>
    </Segment>
  );
}
MyProducts.propTypes = {
  shopId: PropTypes.string.isRequired,
};
