Page({
  // 统一路由跳转处理 [cite: 70]
  navTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
      fail: (err) => {
        wx.showToast({ title: '模块开发中', icon: 'none' });
      }
    });
  }
});