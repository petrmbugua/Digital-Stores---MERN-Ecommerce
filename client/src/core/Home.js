import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import Suggestions from '../product/Suggestions';
import { listLatest, listCategories } from '../product/api-product.js';
import Search from '../product/Search';
import Categories from '../product/Categories';

export default function Home() {
  const [suggestionTitle, setSuggestionTitle] = useState('Latest Products');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listLatest(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setSuggestions(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Search categories={categories} />
            <Categories categories={categories} />
          </Grid.Column>
          <Grid.Column>
            <Suggestions products={suggestions} title={suggestionTitle} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
