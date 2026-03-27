import { getWords } from '../../api/word.js';

Page({
  data: {
    wordList: [],
    page: 1,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.fetchWords();
  },

  async fetchWords() {
    if (this.data.loading || !this.data.hasMore) return;
    this.setData({ loading: true });
    
    try {
      const res = await getWords(this.data.page, 20); // 调用接口获取数据 [cite: 209, 211]
      const items = res.items || [];
      this.setData({
        wordList: [...this.data.wordList, ...items],
        hasMore: items.length === 20,
        page: this.data.page + 1
      });
      // 将数据存入全局，方便详情页直接读取用于 Swiper 渲染
      getApp().globalData.currentWordList = this.data.wordList;
    } catch (err) {
      console.error('获取单词列表失败', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    this.fetchWords(); // 触底加载下一页
  },

  navToDetail(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/word/detail?index=${index}`
    });
  }
});