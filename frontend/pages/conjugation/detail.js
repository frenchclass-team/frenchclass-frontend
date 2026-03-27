import { getQuestionDetail } from '../../api/question.js';

Page({
  data: {
    questionId: null,
    stem: '',
    answerList: []
  },

  onLoad(options) {
    // 1. 严格校验是否传入了 ID
    const id = options.id;
    if (!id) {
      wx.showToast({ title: '参数错误，缺少动词ID', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    
    this.setData({ questionId: id });
    this.fetchVerbDetail(id);
  },

  async fetchVerbDetail(id) {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await getQuestionDetail(id);
      
      // 2. 防御性校验：确保是变位题
      if (res && res.type === 'conjugation' && res.answerJson) {
        const answerList = Object.keys(res.answerJson).map(key => {
          return { person: key, verb: res.answerJson[key] };
        });
        
        // 人称固定排序逻辑
        const order = ['je', 'tu', 'il/elle', 'il', 'elle', 'nous', 'vous', 'ils/elles', 'ils', 'elles'];
        answerList.sort((a, b) => order.indexOf(a.person) - order.indexOf(b.person));

        this.setData({ 
          stem: res.stem, 
          answerList 
        });
      } else {
        wx.showToast({ title: '当前题目不是动词变位题', icon: 'none' });
        this.setData({ stem: '该题目非变位题，无法展示' });
      }
    } catch(err) {
      console.error('获取变位详情失败', err);
      wx.showToast({ title: '获取数据失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  // 跳转至测试页
  navToTest() {
    if (!this.data.answerList || this.data.answerList.length === 0) {
      return wx.showToast({ title: '无效题目，无法自测', icon: 'none' });
    }
    wx.navigateTo({
      url: `/pages/conjugation/test?id=${this.data.questionId}`
    });
  }
});