import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Logo } from "../../../assets/logo.svg";

import { getUserinfo } from "utils/auth";

import config from "config/app";

import Authentication from "@/Authentication";

import UpdatePwdDialogContent from './UpdatePwdDialogContent'

import { useDispatch } from 'react-redux'

import { empty as brand_empty } from 'store/slices/brand'
import { empty as class_empty } from 'store/slices/class'
import { empty as place_empty } from 'store/slices/place'
import { empty as org_empty } from 'store/slices/org'
import { empty as employee_empty } from 'store/slices/employee'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "#fff",
    fontWeight: 400,
  },
  subMenu: {
    marginTop: 25,
    marginLeft: 20,
  },
}));

const MenuAppBar = (props) => {
  const dispatch = useDispatch()
  const { history } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearEnumsCache = () => {
    dispatch(brand_empty())
    dispatch(class_empty())
    dispatch(place_empty())
    dispatch(org_empty())
    dispatch(employee_empty())
  }

  const handleSignout = () => {
    Authentication.signout(() => {
      clearEnumsCache()
      history.replace({ pathname: "/sign-in" });
    });
    setAnchorEl(null);
  };

  const handleUpdatePwd = () => {
    global.$showModal({
      content: <UpdatePwdDialogContent />,
      title: "修改密码",
    })
  }

  return (
    <div className={classes.root}>
      <AppBar elevation={0} position="static">
        <Toolbar variant="dense">
          <Logo
            style={{
              width: 48,
              height: 48,
            }}
          />
          <Typography variant="h6" className={classes.title}>
            {config.title}
          </Typography>
          <Button startIcon={<AccountCircle style={{ color: "#fff" }} />} onClick={handleMenu}>
            <Typography
              style={{
                color: "#fff",
                fontSize: 13,
              }}
            >
              {getUserinfo().userName}
            </Typography>
          </Button>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
            className={classes.subMenu}
          >
            <MenuItem style={{ fontSize: 14 }} onClick={handleUpdatePwd}>
              修改密码
            </MenuItem>
            <MenuItem style={{ fontSize: 14 }} onClick={handleSignout}>
              退出登录
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

MenuAppBar.propTypes = {
  history: PropTypes.object,
};

export default withRouter(MenuAppBar);
