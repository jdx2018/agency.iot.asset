import React, { useState } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import store from './store';
import { Provider } from 'react-redux';

import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";

import "dayjs/locale/zh-cn";

import { MdMessage, MdBackdrop } from "components";

import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { hot } from "react-hot-loader";
import appConfig from "config/app";
import "react-perfect-scrollbar/dist/css/styles.css";
import dbClient from "db-client";
import { LeftNav, Topnav } from "@/routes/Layout";

import Signin from "@/routes/Signin";
import ForgetPassword from "@/routes/ForgetPassword";

import "./App.less";
import { getPageData } from "utils/auth";

import viewsList from "utils/viewsList";

import NotFound from "./views/NotFound";
import Test from './views/Test'

import LoadingPage from './views/LoadingPage'

import AntModal from 'components/AntModal'

import { Scrollbars } from "react-custom-scrollbars"

dbClient.setConfig({
  url: window.g.url,
  end_point: window.g.end_point,
  sign_params: appConfig.sign_params,
});

const { globalStyles } = appConfig;

const theme = createMuiTheme(globalStyles);


function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        sessionStorage.getItem('isAuthenticated') === '1' ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/sign-in",
                state: { from: location },
              }}
            />
          )
      }
    />
  );
}

function App() {
  const [originMenuData, setOriginMenuData] = useState([])
  const handleLoginSuccess = React.useCallback(() => {
    const pageList = getPageData() ? getPageData() : [];
    setOriginMenuData(pageList)
  }, [])
  return (
    <>
      <CssBaseline />
      <ConfigProvider locale={zhCN}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <Switch>
                <Route path="/sign-in">
                  <Signin loginSuccess={handleLoginSuccess} />
                </Route>
                <Route path="/forgot-password">
                  <ForgetPassword />
                </Route>
                <PrivateRoute path="/">
                  <div className="root">
                    <div className="top">
                      <Topnav />
                    </div>
                    <div className="left">
                      <LeftNav originMenuData={originMenuData} loginSuccess={handleLoginSuccess} />
                    </div>
                    <div className="content">
                    <Scrollbars>
                      <Switch>
                        <Redirect exact from="/" to="/Dashboard" />
                        {originMenuData.map((menu) => {
                          if (menu.componentName) {
                            return (
                              <Route key={menu.pageId} path={`/${menu.componentName}`}>
                                <React.Suspense fallback={<LoadingPage />}>
                                  {viewsList[menu.componentName] ? (
                                    React.createElement(viewsList[menu.componentName])
                                  ) : (
                                      <Redirect to="/not-found" />
                                    )}
                                </React.Suspense>
                              </Route>
                            );
                          }
                          return null;
                        })}
                        <Route path="/index">
                          <div>主页</div>
                        </Route>
                        <Route path="/test">
                          <Test />
                        </Route>
                        <Route path="/not-found">
                          <NotFound />
                        </Route>
                        <Redirect to="/not-found" />
                      </Switch>
                    </Scrollbars>
                    </div>
                  </div>
                </PrivateRoute>
              </Switch>
            </Router>
            <AntModal />
            <MdMessage />
            <MdBackdrop />
          </Provider>
        </ThemeProvider>
      </ConfigProvider>

    </>
  );
}

export default hot(module)(App);
