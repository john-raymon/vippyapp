import React from "react";

// material-ui components
import TextField from "@material-ui/core/TextField";

const FormField = ({ ...rest }) => {
  return (
    <TextField
      InputProps={{
        className: `michroma-important lh-title f7-important MUIRegisterOverride`
      }}
      InputLabelProps={{
        className: "michroma-important white-important o-80 tracked"
      }}
      fullWidth={true}
      {...rest}
    />
  );
};

export default FormField;
