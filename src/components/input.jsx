import { TextField, InputAdornment } from '@mui/material';

function Input({ type, label, value, setValue, error, width, inputProps }) {
  return (
    <TextField
      type={type ? type : 'text'}
      label={label}
      sx={{ mb: 3, width: `${width ? width : 80}%` }}
      value={value}
      error={error !== null && error !== undefined}
      helperText={error}
      onChange={(event) => {
        setValue({
          error: null,
          value: event.target.value,
        });
      }}
      InputProps={inputProps}
    />
  );
}

export default Input;
