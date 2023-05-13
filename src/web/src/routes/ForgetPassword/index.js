import React from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Copyright } from "components";

const useStyle = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      height: "100%",
      backgroundColor: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    content: {
      width: 854,
      height: 468,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    footer: {
      marginTop: 50,
    },
    header: {
      color: "#666",
      fontSize: 20,
      marginTop: 10,
    },
    body: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
    },
    title: {
      fontSize: 30,
      marginTop: 50,
    },
    desc: {
      color: "#666",
      fontSize: 14,
      marginTop: 30,
    },
    submitBtn: {
      color: "#fff",
      marginTop: 30,
    },
    Button_containedPrimary: {
      "&:hover": {
        backgroundColor: "#1769aa",
      },
    },
  };
});

export default function ForgetPassword() {
  const classes = useStyle();
  const { register, handleSubmit, errors } = useForm();
  const handleSignin = (data) => {
    console.log(data);
  };
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.header}>固定资产</div>
        <div className={classes.body}>
          <div className={classes.title}>重置密码</div>
          <div className={classes.desc}>请输入注册的用户名、手机号码：</div>
          <div className={classes.form}>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit(handleSignin)}
            >
              <TextField
                autoComplete="off"
                size="small"
                color="primary"
                inputRef={register({
                  required: "手机号码不能为空",
                  maxLength: { value: 11, message: "手机号码格式不标准" },
                })}
                error={Boolean(errors.phoneNum)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phoneNum"
                label="用户名/手机号码"
                name="phoneNum"
                helperText={errors.phoneNum ? errors.phoneNum.message : ""}
                autoFocus
              />
              <Button
                disableElevation
                type="submit"
                fullWidth
                variant="contained"
                classes={{
                  containedPrimary: classes.Button_containedPrimary,
                }}
                color="primary"
                className={classes.submitBtn}
              >
                下一步
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className={classes.footer}>
        <Copyright />
      </div>
    </div>
  );
}
