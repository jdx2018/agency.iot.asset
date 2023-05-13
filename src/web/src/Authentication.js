import { login } from 'api/login/login'

export default {
  // isAuthenticated: sessionStorage.getItem('isAuthenticated'),
  async authenticate(cb, params) {
    const { tenantId, userId, pwd } = params;
    const res = await login(tenantId, userId, pwd);
    if (res.code === 1) {
      sessionStorage.setItem('isAuthenticated', '1')
      cb.call(null, res.data);
    } else {
      global.$showMessage({
        message: res.message,
        type: "error",
        autoHideDuration: 5000,
      });
    }
  },
  signout(cb) {
    sessionStorage.clear();
    cb();
  },
};
