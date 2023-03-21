export default (mode = 'light') => {
  let background = {};

  if (mode === 'light') {
    background['default'] = '#E7EBF0';
  }

  return {
    palette: {
      mode,
      background,
    },
  };
};
