import React, { useState } from 'react';
import { Menu, Icon, Segment, Button, Label } from 'semantic-ui-react';
import auth from '../auth/auth-helper';
import { Link, withRouter } from 'react-router-dom';
import cart from '../cart/cart-helper';


const Navbar = withRouter(({ history, path }) => {

  const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#bef67a' };
    else return { color: '#ffffff' };
  };

  const isPartActive = (history, path) => {
    if (history.location.pathname.includes(path)) return { color: '#bef67a' };
    else return { color: '#ffffff' };
  };

  const [activeItem, setActiveItem] = useState('home');

  const setActiveItemOnClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={setActiveItemOnClick}
        />
        <>
          <Menu.Item
          >
          <Link to='/'>
              <Icon className='home' style={isActive(history, '/')} />
            </Link>
          </Menu.Item>

          <Menu.Item>
            <Link to='/shops/all'>
              <Button style={isActive(history, '/shops/all')}>All Shops</Button>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/cart'>
              <Button style={isActive(history, '/cart')}>
                Cart
                <Label>
                  <Icon name='cart plus' /> {cart.itemTotal()}
                </Label>
              </Button>
            </Link>
          </Menu.Item>
        </>

        <>
          <Menu.Menu position='right'>
            {!auth.isAuthenticated() && (
              <>
                <Menu.Item>
                  <Link to='/signup'>
                    <Button style={isActive(history, '/signup')}>
                      Sign up
                    </Button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to='/signin'>
                    <Button style={isActive(history, '/signin')}>
                      Sign In
                    </Button>
                  </Link>
                </Menu.Item>
              </>
            )}
            {auth.isAuthenticated() && (
              <>
                {auth.isAuthenticated().user.seller && (
                  <Menu.Item>
                    <Link to='/seller/shops'>
                      <Button style={isPartActive(history, '/seller/')}>
                        My Shops
                      </Button>
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Item>
                  <Link to={'/user/' + auth.isAuthenticated().user._id}>
                    <Button
                      style={isActive(
                        history,
                        '/user/' + auth.isAuthenticated().user._id
                      )}
                    >
                      My Profile
                    </Button>
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Button
                    onClick={() => {
                      auth.clearJWT(() => history.push('/'));
                    }}
                  >
                    Sign out
                  </Button>
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
