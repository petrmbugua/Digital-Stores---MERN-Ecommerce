import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Segment, Divider, Icon, Input } from 'semantic-ui-react';
import { list } from './api-product.js';
import Products from './Products';

export default function Search(props) {
  const [values, setValues] = useState({
    category: '',
    search: '',
    results: [],
    searched: false,
  });
  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };
  const search = () => {
    if (values.search) {
      list({
        search: values.search || undefined,
        category: values.category,
      }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, results: data, searched: true });
        }
      });
    }
  };
  const enterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      search();
    }
  };

  return (
    <Segment>
      <>
        <label>Select Category</label>
        <select value={values.category} onChange={handleChange('category')}>
          <option value='All'>All</option>
          {props.categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* <TextField
          id='select-category'
          select
          label='Select category'
          value={values.category}
          onChange={handleChange('category')}
        >
          <MenuItem value='All'>All</MenuItem>
          {props.categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> */}
      </>

      <Input
        type='search'
        onKeyDown={enterKey}
        onChange={handleChange('search')}
        placeholder='Search...'
        icon={<Icon name='search' onClick={search} inverted circular link />}
      />

      <Divider />

      <Products products={values.results} searched={values.searched} />
    </Segment>
  );
}
Search.propTypes = {
  categories: PropTypes.array.isRequired,
};
