import { useState, useEffect } from 'react';

import useDebounce from '../../hooks/useDebounce';
import { getMoviesByQuery } from '../../services/api';
import { API_KEY } from '../../constants';
import { getMappedResponse } from '../../mapper/moviesMapper';

const AutocompleteContainer = () => {
  // API query text
  const [queryText, setQueryText] = useState('');
  // API search results
  const [results, setResults] = useState([]);
  // Searching status (whether there is a pending API request)
  const [loading, setLoading] = useState(true);
  // Error status (whether the API request has failed)
  const [error, setError] = useState(null);

  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 200ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedQueryText = useDebounce(queryText, 200);

  const handleChange = ({ target: { value } }) => {
    setQueryText(value);
  };

  // Effect for triggering debounced API call
  useEffect(
    () => {
      if (debouncedQueryText) {
        setLoading(true);
        getMoviesByQuery(`?apikey=${API_KEY}&s=${debouncedQueryText}`)
          .then(response => setResults(getMappedResponse(response)))
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
        setError(null);
        setLoading(false);
      }
    },
    [debouncedQueryText] // Only call the effect if debounced search term changes
  );


  return (
    <div className="AutocompleteContainer">
      <label htmlFor="queryText">
        Search movies by title
        <input
          id="queryText"
          name="queryText"
          type="text"
          className="AutocompleteContainer__input"
          aria-label="Search movies by title"
          onChange={handleChange}
        />
        <div className="AutocompleteContainer__suggestions">
          {debouncedQueryText && !loading && !error && !results.length && (
            <div>No results found for your search. Please try a different title.</div>
          )}
          {loading ? (
            <div>Loading...</div>
          ) : (
            error ? (
              <p>We are unable to fetch movies right now. Please try again later.</p>
            ) : (
              results.map(result => (
                <div key={result.imdbID}>
                  <h4>{result.Title}</h4>
                </div>
              ))
            )
          )}
        </div>
      </label>
    </div>
  );
};

export default AutocompleteContainer;
