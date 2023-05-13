import axios from "axios";
import { getToken, setToken, getUserinfo } from "utils/auth";
import config from "config/request";
import history from "utils/history";
// import appConfig from "config/app";
// const { tenantId } = appConfig;

const defaultErrorResponse = {
  code: -1,
  message: "网络请求错误，请稍后再试",
};

const headers = {
  "Content-Type": "application/json",
};
if (window.location.pathname !== "/sign-in") {
  headers.access_token = getToken();
}
const request = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT,
  headers,
  transformRequest: [
    (data) => {
      const __data = JSON.parse(data);
      const userinfo = getUserinfo();
      if (!__data.tenantId) __data.tenantId = getUserinfo().tenantId;
      if (!__data.userId) __data.userId = userinfo.userId;
      return JSON.stringify(__data);
    },
  ],
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  () => {
    // throw new Error();
    return defaultErrorResponse;
  }
);

request.interceptors.response.use(
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
  () => {
    // throw new Error();
    return defaultErrorResponse;
  }
);

const fetcher = (body) => {
  return request.post("/iot/graphOperate", body);
};

export default fetcher;
