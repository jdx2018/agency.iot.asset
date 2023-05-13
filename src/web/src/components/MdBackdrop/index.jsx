import React from "react";
import deepmerge from "deepmerge";
import { Backdrop, CircularProgress } from "@material-ui/core";

const defaultState = {
  open: false, // 窗口是否显示
  onClose: () => {}, // 关闭时执行的函数
  children: null, // 内容主体
};

export default class MdBackdrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  showLoading(state) {
    this.setState(
      deepmerge(state, {
        open: true,
        children: <CircularProgress color="inherit" />,
      })
    );
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

  handleClose() {
    this.hide();
    this.setState(defaultState);
    this.state.onClose();
  }

  componentDidMount() {
    let that = this;
    global.$showLoading = (state) => {
      that.showLoading(state);
    };

    global.$hideLoading = () => {
      that.hide();
    };

    global.$showBackdrop = (state) => {
      that.show(state);
    };
    global.$hideBackdrop = () => {
      that.hide();
    };
  }

  render() {
    return (
      <Backdrop
        open={this.state.open}
        onClick={this.handleClose.bind(this)}
        children={this.state.children}
        style={{
          zIndex: 99,
          color: "#fff",
        }}
      />
    );
  }
}
