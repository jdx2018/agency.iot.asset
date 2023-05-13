/* eslint-disable no-useless-computed-key */
/* eslint-disable react-hooks/rules-of-hooks */
const {
  override,
  addWebpackAlias,
  addWebpackPlugin,
  addWebpackExternals,
  useBabelRc,
  addLessLoader,
} = require("customize-cra");
const path = require("path");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const NyanProgressPlugin = require("nyan-progress-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = override(
  useBabelRc(),
  addWebpackAlias({
    "react-dom": "@hot-loader/react-dom",
    ["@"]: path.resolve(__dirname, "src"),
    ["api"]: path.resolve(__dirname, "src/api"),
    ["config"]: path.resolve(__dirname, "src/config"),
    ["services"]: path.resolve(__dirname, "src/services"),
    ["utils"]: path.resolve(__dirname, "src/utils"),
    ["views"]: path.resolve(__dirname, "src/views"),
    ["routes"]: path.resolve(__dirname, "src/routes"),
    ["components"]: path.resolve(__dirname, "src/components"),
    ["hooks"]: path.resolve(__dirname, "src/hooks"),
    ["store"]: path.resolve(__dirname, "src/store"),
  }),

  addWebpackPlugin(
    new NyanProgressPlugin({
      debounceInterval: 60,
      nyanCatSays(progress, messages) {
        if (progress === 1) {
          return "Bug写完啦～";
        }
      },
    })
  ),
  addWebpackPlugin(
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled", // 不启动展示打包报告的http服务器
      // generateStatsFile: true, // 是否生成stats.json文件
    })
  ),
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),
  addWebpackExternals({
    xlsx: "XLSX",
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#00bcd4" },
    },
  }),

  (config, env) => {
    config = rewireReactHotLoader(config, env);
    return config;
  }
);
