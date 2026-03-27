import { getPhonetics } from '../../api/phonetic.js';

Page({
  data: {
    category: '',
    phoneticList: []
  },

  onLoad(options) {
    const categoryName = options.name || '音素列表';
    wx.setNavigationBarTitle({ title: categoryName });
    this.setData({ category: options.category });
    this.fetchData();
  },

  async fetchData() {
    try {
      const res = await getPhonetics(); // 返回完整索引结构 [cite: 128]
      const targetGroup = res.find(item => item.category === this.data.category);
      if (targetGroup) {
        this.setData({ phoneticList: targetGroup.items });
      }
    } catch (err) {
      console.error('获取列表失败', err);
    }
  },

  navToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/phonetic/detail?id=${id}`
    });
  }
});