import React from 'react';
import PropTypes from 'prop-types';
import { Card,  Segment, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AddToCart from './../cart/AddToCart';

export default function Products(props) {
  return (
    <>
      {props.products.length > 0 ? (
        <Segment>
          
           
              {props.products.map((product, i) => (
                <>
                  <Link to={'/product/' + product._id}>
                    <Image
                    size='small'
                      src={'/api/product/image/' + product._id}
                      alt={product.name}
                    />
                  </Link>
                  <Card.Content>
                    <Card.Header>
                      <Link to={'/product/' + product._id}>{product.name}</Link>
                    </Card.Header>
                    <Card.Meta>Ksh. {product.price}</Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    <AddToCart item={product} />
                  </Card.Content>
                </>
              ))}
            
        
        </Segment>
      ) : (
        props.searched && <Segment>No products found! :(</Segment>
      )}
    </>
  );
}
Products.propTypes = {
  products: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
};
