import React from 'react';
import PropTypes from 'prop-types';
import { Item, Segment, Icon, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import AddToCart from './../cart/AddToCart';

export default function Suggestions(props) {
  return (
    <>
      <Segment>{props.title}</Segment>

      {props.products.map((item, i) => {
        return (
          <span key={i}>
            <Item.Group>
              <Item>
                <Item.Image
                  size='small'
                  src={'/api/product/image/' + item._id}
                />
                <Item.Content>
                  <Item.Header>
                    <Link to={'/product/' + item._id}>{item.name}</Link>

                    <Item.Meta>
                      <Link to={'/shops/' + item.shop._id}>
                        <Icon name='shopping basket' /> {item.shop.name}
                      </Link>
                    </Item.Meta>
                  </Item.Header>
                  <Item.Meta>
                    <span className='price'>Ksh. {item.price}</span>
                    <Item.Description>
                      <Link to={'/product/' + item._id}>
                        <Icon name='eye' size='big' />
                      </Link>
                      <AddToCart item={item} />
                    </Item.Description>
                    <span className='price'>
                      Added on {new Date(item.created).toDateString()}
                    </span>
                  </Item.Meta>
                </Item.Content>
              </Item>
            </Item.Group>
            <Divider />
          </span>
        );
      })}
    </>
  );
}

Suggestions.propTypes = {
  products: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
