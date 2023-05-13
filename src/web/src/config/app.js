import { grey, green, red, yellow } from "@material-ui/core/colors";

export default {
  // login_auth_target_url:
  // "http://197.3.179.112:9000/SOAM/oauth/authorize?response_type=code&client_id=P73&redirect_uri=http://193.20.12.206/iot/graphOperate?userId=1001",
  // login_auth_target_url: "http://iot.supoin.com:8202",
  title: "固定资产管理系统",
  defaultViewName: "Dashboard",
  tenantId: "supoin",
  sign_params: {
    key: "supoin.iot@sz209",
    iv: "iot.supoin#Sz802",
    salt: "supoin@ms.bank",
  },
  defaultColumnWidth: 150,
  globalMsgStyles: {
    success: {
      backgroundColor: green[300],
    },
    error: {
      backgroundColor: red[300],
    },
    warning: {
      backgroundColor: yellow[300],
    },
    info: {
      backgroundColor: grey[300],
    },
  },
  // Material-ui全局部分覆盖样式
  globalStyles: {
    grey,
    palette: {
      primary: {
        main: "#00bcd4",
      },
      secondary: {
        main: "#00b0ff",
      },
      default: {
        main: grey[500],
      },
      text: {
        primary: grey[700],
        secondary: grey[500],
        hint: grey[300],
        disabled: grey[200],
      },
    },
    typography: {
      body1: {
        fontWeight: 400,
      },
      body2: {
        fontWeight: 400,
      },
      button: {
        fontWeight: 400,
      },
    },
  },
};
