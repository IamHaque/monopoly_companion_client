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
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  };
};
