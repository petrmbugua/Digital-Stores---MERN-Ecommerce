import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import CartItems from './CartItems';
import Checkout from './Checkout';

export default function Cart() {
  const [checkout, setCheckout] = useState(false);

  const showCheckout = (val) => {
    setCheckout(val);
  };

  return (
    <>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <CartItems checkout={checkout} setCheckout={showCheckout} />
          </Grid.Column>
          {checkout && (
            <Grid.Column>
              <Checkout />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}
