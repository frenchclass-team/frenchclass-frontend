import { getVerbList } from '../../api/question.js';

Page({
  data: {
    verbList: []
  },

  onLoad() {
    this.fetchList();
  },

  async fetchList() {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await getVerbList();
      if (res && res.length >= 0) {
        this.setData({ verbList: res });
      }
    } catch (err) {
      console.error('获取动词列表失败', err);
      wx.showToast({ title: '获取列表失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/conjugation/detail?id=${id}`
    });
  }
});