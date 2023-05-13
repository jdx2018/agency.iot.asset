import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLocation,
  useHistory
} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Button, Grid, CircularProgress } from "@material-ui/core";
import { setUserinfo, setPageData } from "utils/auth";
import Authentication from "@/Authentication";


const styles = {
  labelRoot: {
    fontSize: 14,
  },
};

function AccountSignin(props) {
  const history = useHistory()
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  const { classes, classes__, loginSuccess } = props;
  const { register, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);

  const handleSignin = async (data) => {
    setLoading(true);
    try {
      await Authentication.authenticate((data) => {
        if (!data.page || data.page.length === 0) {
          global.$showMessage({
            message: "无页面权限，请联系管理员",
            type: "error",
            autoHideDuration: 5000,
          });
          setLoading(false);
          return
        }
        setPageData(data.page);
        setUserinfo(data.userinfo);
        loginSuccess()
        global.$showMessage({
          message: "登录成功",
          type: "success",
        });
        setLoading(false);
        history.push(from.pathname)
      }, data);
      setLoading(false);
    } catch (err) {
      global.$showMessage({
        message: "网络连接错误",
        autoHideDuration: 5000,
        type: "error",
      });
      setLoading(false);
      throw new Error(err);
    }
  };

  return (
    <form className={classes__.form} noValidate onSubmit={handleSubmit(handleSignin)}>
      <TextField
        size="small"
        color="primary"
        inputRef={register({
          required: "企业账户不能为空",
          maxLength: { value: 20, message: "长度最大不能超过20个字符" },
        })}
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        error={Boolean(errors.tenantId)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="企业账户"
        name="tenantId"
        helperText={errors.tenantId ? errors.tenantId.message : ""}
      />
      <TextField
        size="small"
        color="primary"
        inputRef={register({
          required: "用户名不能为空",
          maxLength: { value: 20, message: "长度最大不能超过20个字符" },
        })}
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        error={Boolean(errors.userId)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="用户名"
        name="userId"
        helperText={errors.userId ? errors.userId.message : ""}
      />
      <TextField
        size="small"
        color="primary"
        inputRef={register({
          required: "密码不能为空",
          maxLength: { value: 20, message: "长度最大不能超过20个字符" },
        })}
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        error={Boolean(errors.pwd)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="pwd"
        label="密码"
        type="password"
        helperText={errors.pwd ? errors.pwd.message : ""}
      />
      <div className={classes__.Button_wrapper}>
        <Button
          disableElevation
          disabled={loading}
          className={classes__.Button_base}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          登录
        </Button>
        {loading && <CircularProgress size={24} className={classes__.Button_progress} />}
      </div>
      <Grid className={classes__.otherAction} container>
        <Grid item xs>
          {/* <Link
            underline="none"
            onClick={(e) => {
              e.preventDefault();
              props.onSigninTypeChange(1);
            }}
            color="primary"
            href="#"
            variant="body2"
          >
            手机验证码登录
          </Link> */}
        </Grid>
        <Grid item>
          {/* <Link
            underline="none"
            onClick={handleForgetPassword}
            className={classes__.grayText}
            href="#"
            variant="body2"
          >
            忘记密码？
          </Link> */}
        </Grid>
      </Grid>
    </form>
  );
}

export default withStyles(styles)(AccountSignin);
