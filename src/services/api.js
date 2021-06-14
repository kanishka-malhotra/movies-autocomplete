export const baseUrl = 'http://www.omdbapi.com/';
export const moviesUrl = `${baseUrl}?t=`;

export const getMoviesByQuery = async (queryText) => {
  return await fetch(`${moviesUrl}${queryText}`).then(response => response.json());
};
