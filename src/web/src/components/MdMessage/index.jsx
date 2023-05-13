import React from "react";
import deepmerge from "deepmerge";

import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const defaultState = {
  open: false, // 是否显示
  message: "", // 消息主体
  type: "", // 消息类型
  onClose: () => {}, // 关闭时执行的函数
  autoHideDuration: 0, // 消息持续时间， ms
  anchorOrigin: null, // 消息显示位置，api同 Snackbar 组件
};

export default class MdMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  show(state) {
    this.setState(
      deepmerge(state, {
        open: true,
      })
    );
  }

  hide() {
    this.setState(
      deepmerge(this.state, {
        open: false,
      })
    );
  }

  handleClose(event, reason) {
    // if (reason === "clickaway") {
    //   return;
    // }
    this.hide();

    this.state.onClose();
  }

  componentDidMount() {
    let that = this;
    global.$showMessage = (state) => {
      that.show(state);
    };
    global.$hideMessage = () => {
      that.hide();
    };
  }

  render() {
    return (
      <Snackbar
        open={this.state.open}
        onClose={this.handleClose.bind(this)}
        autoHideDuration={this.state.autoHideDuration || 3000}
        anchorOrigin={
          this.state.anchorOrigin || { vertical: "top", horizontal: "center" }
        }
      >
        <Alert severity={this.state.type || "info"}>
          {this.state.message || "提示内容"}
        </Alert>
      </Snackbar>
    );
  }
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
