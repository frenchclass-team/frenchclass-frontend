App({
  onLaunch() {
    this.checkLoginStatus();
  },
  
  // 在 app.js 实现启动检查，未登录重定向至登录页
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({
        url: '/pages/auth/login'
      });
    }
  },

  globalData: {
    userInfo: null
  }
})