import React from "react";
import { Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.grey[700],
  },
  link: {
    color: theme.grey[800],
  },
}));

export default function Copyright() {
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant="body2" align="center">
      {"Copyright © "}
      <Link
        className={classes.link}
        underline="none"
        color="inherit"
        href="https://www.supoin.com/"
      >
        固定资产
      </Link>&nbsp;
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
