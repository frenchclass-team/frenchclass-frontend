Page({
  navToList(e) {
    const { category, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/phonetic/list?category=${category}&name=${name}`
    });
  }
});