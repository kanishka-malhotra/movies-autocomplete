export const baseUrl = 'http://www.omdbapi.com/';

export const getMoviesByQuery = async (endpoint) => {
  return await fetch(`${baseUrl}${endpoint}`).then(response => response.json());
};
