import { login } from '../../api/auth.js';

Page({
  data: {
    identifier: '',
    password: '',
    role: 'student', // 默认角色 [cite: 107]
    loading: false
  },

  onRoleChange(e) {
    this.setData({ role: e.detail.value });
  },

  async handleLogin() {
    const { identifier, password, role } = this.data;
    if (!identifier || !password) {
      return wx.showToast({ title: '请填写完整信息', icon: 'none' });
    }

    this.setData({ loading: true });
    try {
      const res = await login({ identifier, password, role });
      // 存入 token 和 role [cite: 74, 108]
      wx.setStorageSync('token', res.token);
      wx.setStorageSync('role', res.role);
      
      wx.showToast({ title: '登录成功', icon: 'success' });
      // 登录成功后重定向至首页 [cite: 74]
      wx.switchTab({
        url: '/pages/home/index'
      });
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      this.setData({ loading: false });
    }
  }
});