import React, { useState } from 'react';
import { Menu, Icon, Segment, Label } from 'semantic-ui-react';
import auth from '../auth/auth-helper';
import { Link, withRouter } from 'react-router-dom';
import cart from '../cart/cart-helper';

const Navbar = withRouter(({ history }) => {
  const [activeItem, setActiveItem] = useState('home');

  const setActiveItemOnClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item header>Digital Stores</Menu.Item>

        <>
          <Menu.Item
            as={Link}
            to='/'
            name='home'
            active={activeItem === 'home'}
            onClick={setActiveItemOnClick}
          >
            <Icon name='home' />
          </Menu.Item>

          <Menu.Item
            as={Link}
            to='/shops/all'
            name='All Shops'
            active={activeItem === 'All Shops'}
            onClick={setActiveItemOnClick}
          />

          <Menu.Item
            as={Link}
            to='/cart'
            name='cart plus'
            active={activeItem === 'cart plus'}
            onClick={setActiveItemOnClick}
          >
            Cart{' '}
            <Label>
              <Icon name='cart plus' /> {cart.itemTotal()}
            </Label>
          </Menu.Item>
        </>

        <>
          <Menu.Menu position='right'>
            {!auth.isAuthenticated() && (
              <>
                <Menu.Item
                  as={Link}
                  to='/signup'
                  name='Sign up'
                  active={activeItem === 'Sign up'}
                  onClick={setActiveItemOnClick}
                />

                <Menu.Item
                  as={Link}
                  to='/signin'
                  name='Sign In'
                  active={activeItem === 'Sign In'}
                  onClick={setActiveItemOnClick}
                />
              </>
            )}
            {auth.isAuthenticated() && (
              <>
                {auth.isAuthenticated().user.seller && (
                  <Menu.Item
                    as={Link}
                    to='/seller/shops'
                    name='My Shops'
                    active={activeItem === 'My Shops'}
                    onClick={setActiveItemOnClick}
                  >
                    My Shops
                  </Menu.Item>
                )}
                <Menu.Item
                  as={Link}
                  to={'/user/' + auth.isAuthenticated().user._id}
                  name='My Profile'
                  active={activeItem === 'My Profile'}
                  onClick={setActiveItemOnClick}
                >
                  {' '}
                  My Profile
                </Menu.Item>

                <Menu.Item
                  onClick={() => {
                    auth.clearJWT(() => history.push('/'));
                  }}
                >
                  {' '}
                  Sign out
                </Menu.Item>
              </>
            )}
          </Menu.Menu>
        </>
      </Menu>
    </Segment>
  );
});

export default Navbar;
