import React, { useState, useEffect } from "react";
import { Typography, Tabs, Tab, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import bg from './bg.jpeg'

import {
  AccountSignin,
  // , CellphoneSignin
} from "./components";
import { Copyright } from "components";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      height: "100%",
      width: "100%",
      "& header": {
        width: "100%",
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      "& content": {
        backgroundColor: "#fff",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      "& footer": {
        marginTop: 50,
      },
    },
    headerContent: {
      width: "80%",
      height: "100%",
      alignSelf: "flex-start",
      fontSize: 24,
      color: "#666",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    title: {
      lineHeight: "100px",
    },
    contentBody: {
      paddingLeft: 50,
      paddingRight: 50,
      width: "100%",
      height: 588,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: 'center',
      maxWidth: 2160
    },
    signinForm: {
      width: 410,
      height: 500,
      backgroundColor: "#fafafa",
      borderRadius: 12,
    },
    otherAction: {
      marginTop: 10,
    },
    grayText: {
      color: "#666",
    },
    Button_containedPrimary: {
      "&:hover": {
        backgroundColor: "#1769aa",
      },
    },
    Button_wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    Button_base: {
      color: "#fff",
      marginTop: 10,
      "&:hover": {
        backgroundColor: "#1769aa",
      },
    },
    Button_progress: {
      color: "#00bcd4",
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -6,
      marginLeft: -12,
    },
  };
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography component="div" role="tabpanel" {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function SignIn(props) {
  const classes = useStyles();
  const [tabIdx, setTabIdx] = useState(0);

  function handleChange(e, newVal) {
    setTabIdx(newVal);
  }

  function handleCheckoutSigninType(idx) {
    setTabIdx(idx);
  }

  useEffect(() => {
    window.sessionStorage.clear();
  }, []);

  return (
    <div className={classes.root}>
      <header>
        <div className={classes.headerContent}>
          <Logo
            style={{
              width: 70,
              height: 70,
            }}
          />
          <span className={classes.title}>固定资产管理系统</span>
        </div>
      </header>
      <content>
        <div className={classes.contentBody}>
          <div className={classes.signinForm}>
            <Tabs
              style={{
                color: "#666",
              }}
              value={tabIdx}
              onChange={handleChange}
              centered
            >
              <Tab
                style={{
                  fontSize: 16,
                }}
                label="帐号登录"
              />
              {/* <Tab
                style={{
                  fontSize: 16,
                }}
                label="验证码登录"
              /> */}
            </Tabs>
            <TabPanel value={tabIdx} index={0}>
              <AccountSignin {...props} onSigninTypeChange={handleCheckoutSigninType} classes__={classes} />
            </TabPanel>
            {/* <TabPanel value={tabIdx} index={1}>
              <CellphoneSignin
                {...props}
                onSigninTypeChange={handleCheckoutSigninType}
                classes__={classes}
              />
            </TabPanel> */}
          </div>
        </div>
      </content>
      <footer>
        <Copyright />
      </footer>
    </div>
  );
}

export default SignIn;
