import { useState, useEffect, useRef } from 'react';

import useDebounce from '../../hooks/useDebounce';
import useOnClickOutside from '../../hooks/useOnClickOutside';
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
  // Whether results should be displayed
  const [showResults, setShowResults] = useState(false);
  // Active result based on user selection
  const [activeResult, setActiveResult] = useState(false);
  // Autocomplete wrapper reference
  const wrapperRef = useRef(null);

  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 200ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedQueryText = useDebounce(queryText, 200);

  const handleChange = ({ target: { value } }) => {
    setQueryText(value);
    setError(null);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleClickOutside = () => {
    setShowResults(false);
  };

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      setShowResults(false);
      setActiveResult(0);
    }
    // User pressed the up arrow, increment the index
    else if (keyCode === 38) {
      if (activeResult === 0) {
        return;
      }
      setActiveResult(activeResult => activeResult - 1);
    }
    // User pressed the down arrow, increment the index
    else if (keyCode === 40) {
      if (activeResult - 1 === results.length) {
        return;
      }
      setActiveResult(activeResult => activeResult + 1 );
    }
  };

  // Effect for triggering debounced API call
  useEffect(
    () => {
      if (debouncedQueryText) {
        setLoading(true);
        setShowResults(true);
        getMoviesByQuery(`?apikey=${API_KEY}&s=${debouncedQueryText}`)
          .then(response => setResults(getMappedResponse(response)))
          .catch(() => {
            setError(true);
            setShowResults(false);
          })
          .finally(() => setLoading(false));
      } else {
        setResults([]);
        setError(null);
        setLoading(false);
        setShowResults(false);
      }
    },
    [debouncedQueryText] // Only call the effect if debounced search term changes
  );

  useOnClickOutside(wrapperRef, handleClickOutside);

  return (
    <div ref={wrapperRef} className="AutocompleteContainer">
      <label htmlFor="queryText">
        Search movies by title
        <input
          id="queryText"
          name="queryText"
          type="text"
          className="AutocompleteContainer__input"
          aria-label="Search movies by title"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
      </label>

      {showResults && (
        <div className="AutocompleteContainer__results">
          {loading ? (
            <div>Loading...</div>
          ) : (
            results.length ? (
              results.map(result => (
                <div key={result.imdbID} className={`AutocompleteContainer__result${activeResult ? ' active' : ''}`}>
                  <h4>{result.Title}</h4>
                </div>
              ))
            ) : (
              <div className="AutocompleteContainer__no-result">No results found for your search. Please try a different title.</div>
            )
          )}
        </div>
      )}

      {error && (
        <p class="AutocompleteContainer__error">
          We are unable to fetch movies right now. Please try again later.
        </p>
      )}
    </div>
  );
};

export default AutocompleteContainer;
