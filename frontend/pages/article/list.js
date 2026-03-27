import { getArticles } from '../../api/article.js';

Page({
  data: {
    articleList: [],
    page: 1,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.fetchData();
  },

  async fetchData() {
    if (this.data.loading || !this.data.hasMore) return;
    this.setData({ loading: true });
    
    try {
      const res = await getArticles(this.data.page, 20);
      const items = res.items || [];
      this.setData({
        articleList: [...this.data.articleList, ...items],
        hasMore: items.length === 20,
        page: this.data.page + 1
      });
    } catch (err) {
      console.error('获取文章列表失败', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    this.fetchData();
  },

  navToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/article/detail?id=${id}`
    });
  }
});