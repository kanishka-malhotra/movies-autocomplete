export const getMappedResponse = response => {
  if (response.Error) {
    return [];
  } else {
    return response.Search;
  }
};
