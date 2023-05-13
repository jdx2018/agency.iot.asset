import axios from "axios";
import { getToken, setToken, getUserinfo } from "utils/auth";
import config from "config/request";
import history from "utils/history";
// import appConfig from "config/app";
// const { tenantId } = appConfig;

// const defaultErrorResponse = {
//   code: -1,
//   message: "网络请求错误，请稍后再试",
// };

const GFetchFunc = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (window.location.pathname !== "/sign-in") {
    headers.access_token = getToken();
  }
  const fetch = axios.create({
    baseURL: config.BASE_URL,
    timeout: config.TIMEOUT,
    headers,
    transformRequest: [
      (data) => {
        const userinfo = getUserinfo();
        if (!!userinfo) {
          if (!data.tenantId) data.tenantId = getUserinfo().tenantId;
          if (!data.userId) data.userId = userinfo.userId;
        }
        return JSON.stringify(data);
      },
    ],
  });

  fetch.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      throw new Error(error);
    }
  );

  fetch.interceptors.response.use(
    (response) => {
      if (response.data.code === -23) {
        history.push("/sign-in");
        return response.data;
      }
      if (
        window.location.pathname !== "/sign-in" &&
        response.headers.access_token
      ) {
        setToken(response.headers.access_token);
      }
      return response.data;
    },
    (error) => {
      throw new Error(error);
    }
  );
  return fetch;
};

export default GFetchFunc;
