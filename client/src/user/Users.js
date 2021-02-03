import React, { useState, useEffect } from 'react';
import { Segment, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { list } from './api-user.js';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Segment>
      <Segment>All Users</Segment>
      <List divided relaxed>
        <List.Item>
          {users.map((item, i) => {
            return (
              <Link to={'/user/' + item._id} key={i}>
                <List.Icon name='user' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>{item.name}</List.Header>
                </List.Content>
              </Link>
            );
          })}
        </List.Item>
      </List>
    </Segment>
  );
}
