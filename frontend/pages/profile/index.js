import { getUserProfile } from '../../api/user.js';

Page({
  data: {
    userInfo: {}
  },

  onShow() {
    this.fetchUserProfile();
  },

  async fetchUserProfile() {
    try {
      const res = await getUserProfile();
      this.setData({ userInfo: res }); // [cite: 110]
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  },

  handleSetting() {
    // 静态入口，点击后弹出 Actionsheet 或跳转设置页
    wx.showToast({ title: '设置功能开发中', icon: 'none' });
  },

  // 退出登录逻辑 [cite: 76]
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除 Token 等凭证
          wx.clearStorageSync();
          // 强制重定向至登录页
          wx.reLaunch({
            url: '/pages/auth/login'
          });
        }
      }
    });
  }
});