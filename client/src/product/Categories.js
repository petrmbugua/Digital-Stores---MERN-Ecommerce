import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Menu, Segment } from 'semantic-ui-react';

import { list } from './api-product.js';
import Products from './Products';

export default function Categories(props) {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(props.categories[0]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list({
      category: props.categories[0],
    }).then((data) => {
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

  const listbyCategory = (category) => (event) => {
    setSelected(category);
    list({
      category: category,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  return (
    <Segment>
      <Segment>Explore by category</Segment>

      <Menu>
        {props.categories.map((tile, i) => (
          <Menu.Item key={i}>
            <Button onClick={listbyCategory(tile)}>{tile} </Button>
          </Menu.Item>
        ))}
      </Menu>

      <Divider />
      <Products products={products} searched={false} />
    </Segment>
  );
}
Categories.propTypes = {
  categories: PropTypes.array.isRequired,
};
